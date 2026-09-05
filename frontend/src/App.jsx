import React, { useState, useEffect } from 'react'
import './App.css'

function App() {
  const [laptops, setLaptops] = useState([])
  const [brandAvg, setBrandAvg] = useState([])
  const [priceDist, setPriceDist] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('overview')

  // 获取数据
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [laptopsRes, brandRes, priceRes] = await Promise.all([
          fetch('/api/laptops').then(res => res.json()),
          fetch('/api/stats/brand_avg').then(res => res.json()),
          fetch('/api/stats/price_dist').then(res => res.json())
        ])
        setLaptops(Array.isArray(laptopsRes) ? laptopsRes : [])
        setBrandAvg(Array.isArray(brandRes) ? brandRes : [])
        setPriceDist(Array.isArray(priceRes) ? priceRes : [])
      } catch (err) {
        console.error('获取数据失败:', err)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>加载数据中...</p>
      </div>
    )
  }

  return (
    <div className="app-container">
      {/* 头部 */}
      <header className="app-header">
        <h1>📊 笔记本市场价格分析系统</h1>
        <p>基于 {laptops.length} 条真实数据 · 价格单位 USD</p>
      </header>

      {/* Tab 切换 */}
      <div className="tab-bar">
        <button 
          className={activeTab === 'overview' ? 'tab active' : 'tab'}
          onClick={() => setActiveTab('overview')}
        >
          📈 概览看板
        </button>
        <button 
          className={activeTab === 'brands' ? 'tab active' : 'tab'}
          onClick={() => setActiveTab('brands')}
        >
          🏷️ 品牌分析
        </button>
        <button 
          className={activeTab === 'list' ? 'tab active' : 'tab'}
          onClick={() => setActiveTab('list')}
        >
          📋 数据列表
        </button>
      </div>

      {/* 内容区 */}
      <div className="tab-content">
        {activeTab === 'overview' && (
          <OverviewTab 
            laptops={laptops} 
            brandAvg={brandAvg} 
            priceDist={priceDist} 
          />
        )}
        {activeTab === 'brands' && (
          <BrandTab brandAvg={brandAvg} laptops={laptops} />
        )}
        {activeTab === 'list' && (
          <ListTab laptops={laptops} />
        )}
      </div>

      {/* 底部 */}
      <footer className="app-footer">
        <p>软件开发实践1 · 笔记本价格分析项目</p>
      </footer>
    </div>
  )
}

// ========== 概览看板 Tab ==========
function OverviewTab({ laptops, brandAvg, priceDist }) {
  // 计算总览指标
  const total = laptops.length
  const avgPrice = laptops.length > 0 
    ? (laptops.reduce((sum, item) => sum + (item.price || 0), 0) / laptops.length).toFixed(0)
    : 0
  const maxPrice = laptops.length > 0 
    ? Math.max(...laptops.map(item => item.price || 0)).toFixed(0)
    : 0
  const minPrice = laptops.length > 0 
    ? Math.min(...laptops.map(item => item.price || 0)).toFixed(0)
    : 0

  // 品牌数量
  const brandCount = new Set(laptops.map(item => item.brand)).size

  return (
    <div>
      {/* 统计卡片 */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-value">{total}</div>
          <div className="stat-label">总数据量</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">${avgPrice}</div>
          <div className="stat-label">平均价格</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">${maxPrice}</div>
          <div className="stat-label">最高价格</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">${minPrice}</div>
          <div className="stat-label">最低价格</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{brandCount}</div>
          <div className="stat-label">品牌数量</div>
        </div>
      </div>

      {/* 两个图表占位（后面用 ECharts 替换） */}
      <div className="charts-row">
        <div className="chart-box">
          <h3>🏷️ 品牌均价排名</h3>
          {brandAvg.length > 0 ? (
            <div className="simple-chart">
              {brandAvg.slice(0, 10).map((item, i) => (
                <div key={i} className="chart-bar-row">
                  <span className="bar-label">{item.brand}</span>
                  <div className="bar-track">
                    <div 
                      className="bar-fill" 
                      style={{ 
                        width: `${Math.min((item.avg_price / Math.max(...brandAvg.map(b => b.avg_price))) * 100, 100)}%`,
                        background: `hsl(${i * 30}, 70%, 50%)`
                      }}
                    ></div>
                  </div>
                  <span className="bar-value">${item.avg_price?.toFixed(0)}</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="no-data">暂无品牌数据</p>
          )}
        </div>

        <div className="chart-box">
          <h3>📊 价格区间分布</h3>
          {priceDist.length > 0 ? (
            <div className="simple-chart">
              {priceDist.map((item, i) => (
                <div key={i} className="chart-bar-row">
                  <span className="bar-label">{item.range_label}</span>
                  <div className="bar-track">
                    <div 
                      className="bar-fill" 
                      style={{ 
                        width: `${Math.min((item.count / Math.max(...priceDist.map(p => p.count))) * 100, 100)}%`,
                        background: `hsl(${i * 40 + 200}, 70%, 50%)`
                      }}
                    ></div>
                  </div>
                  <span className="bar-value">{item.count}台</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="no-data">暂无价格分布数据</p>
          )}
        </div>
      </div>
    </div>
  )
}

// ========== 品牌分析 Tab ==========
function BrandTab({ brandAvg, laptops }) {
  const [selectedBrand, setSelectedBrand] = useState('')
  const brands = [...new Set(laptops.map(item => item.brand).filter(Boolean))]

  // 筛选该品牌的数据
  const filtered = selectedBrand 
    ? laptops.filter(item => item.brand === selectedBrand)
    : laptops

  const avgPrice = filtered.length > 0 
    ? (filtered.reduce((sum, item) => sum + (item.price || 0), 0) / filtered.length).toFixed(0)
    : 0

  return (
    <div>
      <div className="filter-section">
        <label>选择品牌：</label>
        <select value={selectedBrand} onChange={(e) => setSelectedBrand(e.target.value)}>
          <option value="">全部品牌</option>
          {brands.map((brand, i) => (
            <option key={i} value={brand}>{brand}</option>
          ))}
        </select>
        {selectedBrand && (
          <span className="brand-stats">
            共 {filtered.length} 款 · 均价 ${avgPrice}
          </span>
        )}
      </div>

      <div className="brand-grid">
        {brandAvg.map((item, i) => (
          <div 
            key={i} 
            className={`brand-card ${selectedBrand === item.brand ? 'active' : ''}`}
            onClick={() => setSelectedBrand(item.brand)}
          >
            <div className="brand-name">{item.brand}</div>
            <div className="brand-price">${item.avg_price?.toFixed(0)}</div>
            <div className="brand-count">{item.count} 款</div>
          </div>
        ))}
      </div>
    </div>
  )
}

// ========== 数据列表 Tab ==========
function ListTab({ laptops }) {
  const [search, setSearch] = useState('')
  const [sortBy, setSortBy] = useState('price')
  const [sortOrder, setSortOrder] = useState('desc')

  // 搜索过滤
  const filtered = laptops.filter(item => 
    (item.brand || '').toLowerCase().includes(search.toLowerCase()) ||
    (item.name || '').toLowerCase().includes(search.toLowerCase())
  )

  // 排序
  const sorted = [...filtered].sort((a, b) => {
    const aVal = a[sortBy] || 0
    const bVal = b[sortBy] || 0
    if (typeof aVal === 'string') {
      return sortOrder === 'asc' ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal)
    }
    return sortOrder === 'asc' ? aVal - bVal : bVal - aVal
  })

  return (
    <div>
      <div className="list-controls">
        <input 
          type="text" 
          placeholder="🔍 搜索品牌或型号..." 
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="search-input"
        />
        <div className="sort-controls">
          <label>排序：</label>
          <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
            <option value="price">价格</option>
            <option value="brand">品牌</option>
            <option value="rating">评分</option>
          </select>
          <button onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}>
            {sortOrder === 'asc' ? '↑' : '↓'}
          </button>
        </div>
      </div>

      <div className="table-wrapper">
        <table className="data-table">
          <thead>
            <tr>
              <th>#</th>
              <th>品牌</th>
              <th>型号</th>
              <th>CPU</th>
              <th>内存</th>
              <th>价格 (USD)</th>
              <th>评分</th>
            </tr>
          </thead>
          <tbody>
            {sorted.length === 0 ? (
              <tr><td colSpan="7" className="no-data">没有匹配的数据</td></tr>
            ) : (
              sorted.slice(0, 50).map((item, index) => (
                <tr key={index}>
                  <td>{index + 1}</td>
                  <td><span className="brand-tag">{item.brand || '未知'}</span></td>
                  <td>{item.name?.slice(0, 35) || '未知型号'}</td>
                  <td>{item.cpu || '-'}</td>
                  <td>{item.memory || '-'}</td>
                  <td className="price-cell">${item.price?.toFixed(2)}</td>
                  <td>{item.rating || '-'}</td>
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