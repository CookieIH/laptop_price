import React, { useEffect, useRef } from 'react'
import * as echarts from 'echarts'

const BrandChart = ({ data, loading }) => {
  const chartRef = useRef(null)
  const instance = useRef(null)

  useEffect(() => {
    if (!chartRef.current || loading || !data || data.length === 0) return

    if (!instance.current) {
      instance.current = echarts.init(chartRef.current)
    }

    // 按价格排序
    const sorted = [...data].sort((a, b) => b.avg_price - a.avg_price)

    const option = {
      tooltip: {
        trigger: 'axis',
        formatter: (params) => {
          const p = params[0]
          return `<strong>${p.name}</strong><br/>均价: ¥${p.value.toLocaleString()}`
        }
      },
      grid: {
        left: '8%',
        right: '6%',
        bottom: '12%',
        top: '6%'
      },
      xAxis: {
        type: 'category',
        data: sorted.map(item => item.brand),
        axisLabel: {
          fontSize: 12,
          rotate: 20
        }
      },
      yAxis: {
        type: 'value',
        name: '均价 (¥)',
        nameTextStyle: { fontSize: 12 },
        axisLabel: {
          formatter: (value) => `¥${value.toLocaleString()}`
        }
      },
      series: [{
        type: 'bar',
        data: sorted.map(item => Math.round(item.avg_price)),
        barWidth: '40%',
        itemStyle: {
          color: '#2a7de1',
          borderRadius: [4, 4, 0, 0]
        },
        label: {
          show: true,
          position: 'top',
          formatter: (params) => `¥${params.value.toLocaleString()}`,
          fontSize: 11
        }
      }]
    }

    instance.current.setOption(option)

    const handleResize = () => instance.current?.resize()
    window.addEventListener('resize', handleResize)

    return () => window.removeEventListener('resize', handleResize)
  }, [data, loading])

  useEffect(() => {
    return () => {
      instance.current?.dispose()
      instance.current = null
    }
  }, [])

  if (loading) return <div className="loading"> 加载中...</div>
  if (!data || data.length === 0) return <div className="loading">暂无数据</div>

  return <div ref={chartRef} className="chart-box" />
}

export default BrandChart