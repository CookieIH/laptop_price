import React, { useEffect, useRef } from 'react'
import * as echarts from 'echarts'

const PriceDistChart = ({ data, loading }) => {
  const chartRef = useRef(null)
  const instance = useRef(null)

  useEffect(() => {
    if (!chartRef.current || loading || !data || data.length === 0) return

    if (!instance.current) {
      instance.current = echarts.init(chartRef.current)
    }

    const option = {
      tooltip: {
        trigger: 'item',
        formatter: (params) => {
          return `<strong>${params.name}</strong><br/>数量: ${params.value} 台`
        }
      },
      legend: {
        orient: 'vertical',
        right: '5%',
        top: 'center',
        textStyle: { fontSize: 12 }
      },
      series: [{
        type: 'pie',
        radius: ['40%', '70%'],
        avoidLabelOverlap: true,
        itemStyle: {
          borderRadius: 4,
          borderColor: 'white',
          borderWidth: 2
        },
        label: {
          show: true,
          formatter: (params) => `${params.name}\n${params.percent}%`,
          fontSize: 11
        },
        labelLine: {
          length: 12,
          length2: 16
        },
        emphasis: {
          label: {
            show: true,
            fontSize: 14,
            fontWeight: 'bold'
          }
        },
        data: data.map(item => ({
          name: item.range_label,
          value: item.count
        }))
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

export default PriceDistChart