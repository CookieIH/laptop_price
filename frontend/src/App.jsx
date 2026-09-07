import React, { useState, useEffect } from 'react'
import Home from './pages/Home'
import Search from './pages/Search'
import Recommend from './pages/Recommend'
import Analysis from './pages/Analysis'
import './styles/global.css'

function App() {
  const [data, setData] = useState([])
  const [brands, setBrands] = useState([])
  const [loading, setLoading] = useState(true)
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [currentPage, setCurrentPage] = useState('home')

  useEffect(() => {
    fetch('/api/laptops')
      .then(res => res.json())
      .then(data => {
        console.log('✅ 后端返回数据:', data)
        setData(Array.isArray(data) ? data : [])
        const brandList = [...new Set(data.map(item => item.brand).filter(Boolean))]
        setBrands(brandList)
        setLoading(false)
      })
      .catch(err => {
        console.error('❌ 请求失败:', err)
        setLoading(false)
      })
  }, [])

  const menuItems = [
    { key: 'home', icon: '⌂', label: '首页' },
    { key: 'search', icon: '▣', label: '笔记本查询' },
    { key: 'recommend', icon: '☆', label: '智能推荐' },
    { key: 'analysis', icon: '▥', label: '数据分析' },
  ]

  // 根据当前页面渲染对应组件
  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <Home laptops={data} loading={loading} />
      case 'search':
        return <Search laptops={data} brands={brands} />
      case 'recommend':
        return <Recommend laptops={data} />
      case 'analysis':
        return <Analysis laptops={data} />
      default:
        return <Home laptops={data} loading={loading} />
    }
  }

  if (loading) {
    return (
      <div style={{ padding: '40px', textAlign: 'center', fontFamily: 'Arial' }}>
        <div style={{ 
          display: 'inline-block',
          width: '40px',
          height: '40px',
          border: '4px solid #e2e8f0',
          borderTopColor: '#2563eb',
          borderRadius: '50%',
          animation: 'spin 0.8s linear infinite'
        }}></div>
        <p style={{ marginTop: '16px', color: '#64748b' }}>加载数据中...</p>
        <style>{`
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    )
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#f4f7fb' }}>
      
      {/* ===== 侧边栏 ===== */}
      <aside style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: sidebarOpen ? '220px' : '64px',
        height: '100vh',
        background: '#ffffff',
        borderRight: '1px solid #e2e8f0',
        padding: '20px 12px',
        transition: 'width 0.3s ease',
        zIndex: 100,
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden'
      }}>
        {/* 折叠按钮 */}
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          style={{
            width: '100%',
            padding: '10px',
            border: '1px solid #e2e8f0',
            borderRadius: '10px',
            background: '#f8fafc',
            fontSize: '20px',
            cursor: 'pointer',
            marginBottom: '20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'background 0.2s'
          }}
          onMouseEnter={(e) => e.target.style.background = '#f1f5f9'}
          onMouseLeave={(e) => e.target.style.background = '#f8fafc'}
        >
          {sidebarOpen ? '✕' : '☰'}
        </button>

        {/* Logo */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          paddingBottom: '20px',
          borderBottom: '1px solid #e2e8f0',
          marginBottom: '16px',
          justifyContent: sidebarOpen ? 'flex-start' : 'center'
        }}>
          <span style={{ fontSize: '28px' }}>💻</span>
          {sidebarOpen && (
            <div>
              <div style={{ fontSize: '16px', fontWeight: '800', color: '#172033', lineHeight: '1.2' }}>Laptop Price</div>
              <div style={{ fontSize: '9px', fontWeight: '600', color: '#94a3b8', letterSpacing: '1px' }}>ANALYSIS SYSTEM</div>
            </div>
          )}
        </div>

        {/* 菜单 */}
        <nav style={{ flex: 1 }}>
          {menuItems.map((item) => (
            <button
              key={item.key}
              onClick={() => setCurrentPage(item.key)}
              style={{
                width: '100%',
                padding: '12px 14px',
                marginBottom: '4px',
                border: 'none',
                borderRadius: '10px',
                background: currentPage === item.key ? '#eff6ff' : 'transparent',
                color: currentPage === item.key ? '#1d4ed8' : '#64748b',
                fontWeight: currentPage === item.key ? '700' : '500',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '14px',
                fontSize: '15px',
                transition: 'all 0.2s',
                justifyContent: sidebarOpen ? 'flex-start' : 'center'
              }}
              onMouseEnter={(e) => {
                if (currentPage !== item.key) {
                  e.target.style.background = '#f1f5f9'
                  e.target.style.color = '#1e293b'
                }
              }}
              onMouseLeave={(e) => {
                if (currentPage !== item.key) {
                  e.target.style.background = 'transparent'
                  e.target.style.color = '#64748b'
                }
              }}
            >
              <span style={{ fontSize: '20px', minWidth: '28px', textAlign: 'center' }}>{item.icon}</span>
              {sidebarOpen && <span>{item.label}</span>}
            </button>
          ))}
        </nav>

        {/* 底部装饰 */}
        {sidebarOpen && (
          <div style={{
            padding: '16px 12px',
            background: 'linear-gradient(145deg, #f1f5f9, #f8fafc)',
            borderRadius: '12px',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '28px', marginBottom: '4px' }}>💻</div>
            <div style={{ fontWeight: '700', color: '#172033', fontSize: '13px' }}>更好的选择</div>
            <div style={{ fontSize: '11px', color: '#94a3b8' }}>从数据开始</div>
          </div>
        )}
      </aside>

      {/* ===== 主内容 ===== */}
      <main style={{
        marginLeft: sidebarOpen ? '220px' : '64px',
        padding: '24px 32px',
        flex: 1,
        minHeight: '100vh',
        transition: 'margin-left 0.3s ease'
      }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
          {renderPage()}
        </div>
      </main>
    </div>
  )
}

export default App