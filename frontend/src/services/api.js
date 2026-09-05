import axios from 'axios'

const api = axios.create({
  baseURL: '/api',
  timeout: 10000
})

api.interceptors.response.use(
  response => response.data,
  error => {
    console.error('API Error:', error)
    return Promise.reject(error)
  }
)

export const laptopAPI = {
  // 获取笔记本列表
  getLaptops: (brand = null, limit = 100) => {
    const params = { limit }
    if (brand) params.brand = brand
    return api.get('/laptops', { params })
  },

  // 获取各品牌均价
  getBrandAvg: () => {
    return api.get('/stats/brand_avg')
  },

  // 获取价格分布
  getPriceDist: () => {
    return api.get('/stats/price_dist')
  },

  // 获取品牌列表
  getBrands: () => {
    return api.get('/options/brands')
  },

  // 获取统计数据（组合）
  getStats: async () => {
    const [brandAvg, laptops] = await Promise.all([
      api.get('/stats/brand_avg'),
      api.get('/laptops?limit=1000')
    ])

    const prices = laptops.map(l => l.price).filter(p => p > 0)

    return {
      avg_price: prices.length ? Math.round(prices.reduce((a, b) => a + b, 0) / prices.length) : 0,
      max_price: prices.length ? Math.max(...prices) : 0,
      min_price: prices.length ? Math.min(...prices) : 0,
      total_count: prices.length
    }
  }
}

export default laptopAPI