import React from 'react'

const StatsCards = ({ stats, loading }) => {
  if (loading) {
    return (
      <div className="stats-grid">
        {[1, 2, 3, 4].map(i => (
          <div key={i} className="stat-card">
            <div className="stat-label">加载中...</div>
            <div className="stat-value">—</div>
          </div>
        ))}
      </div>
    )
  }

  const items = [
    { label: ' 平均价格', value: stats?.avg_price ? `¥${stats.avg_price.toLocaleString()}` : '—' },
    { label: ' 最高价格', value: stats?.max_price ? `¥${stats.max_price.toLocaleString()}` : '—' },
    { label: ' 最低价格', value: stats?.min_price ? `¥${stats.min_price.toLocaleString()}` : '—' },
    { label: ' 总样本量', value: stats?.total_count ? stats.total_count.toLocaleString() : '—' }
  ]

  return (
    <div className="stats-grid">
      {items.map((item, idx) => (
        <div key={idx} className="stat-card">
          <div className="stat-label">{item.label}</div>
          <div className="stat-value">{item.value}</div>
        </div>
      ))}
    </div>
  )
}

export default StatsCards