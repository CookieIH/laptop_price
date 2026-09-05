import React, { useState, useEffect } from 'react'
import laptopAPI from './services/api'
import StatsCards from './components/Dashboard/StatsCards'
import BrandChart from './components/Charts/BrandChart'
import PriceDistChart from './components/Charts/PriceDistChart'
import './styles/main.css'

function App() {
  const [laptops, setLaptops] = useState([])
  const [brands, setBrands] = useState([])
  const [brandAvg, setBrandAvg] = useState([])
  const [priceDist, setPriceDist] = useState([])
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [selectedBrand, setSelectedBrand] = useState('')

  const fetchAllData = async () => {
    try {
      setLoading(true)
      setError(null)

      const [brandsRes, brandAvgRes, priceDistRes, statsRes, laptopsRes] = await Promise.all([
        laptopAPI.getBrands(),
        laptopAPI.getBrandAvg(),
        laptopAPI.getPriceDist(),
        laptopAPI.getStats(),
        laptopAPI.getLaptops(selectedBrand || null)
      ])

      setBrands(brandsRes || [])
      setBrandAvg(brandAvgRes || [])
      setPriceDist(priceDistRes || [])
      setStats(statsRes)
      setLaptops(laptopsRes || [])
    } catch (err) {
      console.error('加载失败:', err)
      setError('无法连接后端，请确保后端已启动: cd backends && python main.py')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchAllData()
  }, [selectedBrand])

  const handleBrandChange = (e) => {
    setSelectedBrand(e.target.value)
  }

  const handleReset = () => {
    setSelectedBrand('')
  }

  return (
    <div className="app">
      {/* 头部 */}
      <header className="header">
        <div>
          <h1> 笔记本<span className="highlight">价格分析</span></h1>
          <div className="header-sub">品牌价格对比 · 实时数据</div>
        </div>
        <button className="btn-refresh" onClick={fetchAllData} disabled={loading}>
          {loading ? ' 加载中...' : ' 刷新数据'}
        </button>
      </header>

      {/* 错误提示 */}
      {error && <div className="error"> {error}</div>}

      {/* 统计卡片 */}
      <StatsCards stats={stats} loading={loading} />

      {/* 筛选栏 */}
      <div className="filter-bar">
        <label> 品牌筛选</label>
        <select value={selectedBrand} onChange={handleBrandChange}>
          <option value="">全部品牌</option>
          {brands.map(b => (
            <option key={b} value={b}>{b}</option>
          ))}
        </select>
        <button className="btn btn-secondary" onClick={handleReset}>
           重置
        </button>
        <span style={{ marginLeft: 'auto', color: '#6b7a93', fontSize: '13px' }}>
           共 {laptops.length} 台笔记本
        </span>
      </div>

      {/* 图表区域 */}
      <div className="charts-row">
        <div className="chart-card">
          <div className="chart-title"> 各品牌均价对比</div>
          <BrandChart data={brandAvg} loading={loading} />
        </div>
        <div className="chart-card">
          <div className="chart-title"> 价格区间分布</div>
          <PriceDistChart data={priceDist} loading={loading} />
        </div>
      </div>

      {/* 表格 */}
      <div className="table-wrap">
        <h3 style={{ marginBottom: '12px', fontSize: '15px', color: '#1a2332' }}>
           笔记本列表
        </h3>
        <table>
          <thead>
            <tr>
              <th>品牌</th>
              <th>型号</th>
              <th>价格</th>
              <th>CPU</th>
              <th>内存</th>
              <th>存储</th>
              <th>评分</th>
            </tr>
          </thead>
          <tbody>
            {laptops.length === 0 ? (
              <tr><td colSpan="7" style={{ textAlign: 'center', color: '#999' }}>暂无数据</td></tr>
            ) : (
              laptops.map((l, idx) => (
                <tr key={idx}>
                  <td><strong>{l.brand}</strong></td>
                  <td>{l.model}</td>
                  <td>¥{l.price.toLocaleString()}</td>
                  <td>{l.cpu || '—'}</td>
                  <td>{l.memory || '—'}</td>
                  <td>{l.storage || '—'}</td>
                  <td>{l.rating || '—'}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default App