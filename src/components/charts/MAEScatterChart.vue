<template>
  <div class="chart-container">
    <div ref="chartRef" class="chart"></div>
  </div>
</template>

<script>
import { ref, onMounted, watch, nextTick } from 'vue'
import Highcharts from 'highcharts'

export default {
  name: 'MAEScatterChart',
  props: {
    data: {
      type: Array,
      required: true
    },
    stopLossDistance: {
      type: Number,
      required: true
    }
  },
  setup(props) {
    const chartRef = ref(null)
    let chart = null

    const createChart = () => {
      if (!chartRef.value || !props.data.length) return

      const winningTrades = props.data.filter(point => point.isWinning)
      const losingTrades = props.data.filter(point => !point.isWinning)

      chart = Highcharts.chart(chartRef.value, {
        chart: {
          type: 'scatter',
          backgroundColor: '#171717',
          style: {
            fontFamily: 'Inter, sans-serif'
          }
        },
        title: {
          text: null
        },
        xAxis: {
          title: {
            text: 'Maximum Adverse Excursion (%)',
            style: { color: '#a3a3a3' }
          },
          labels: {
            style: { color: '#a3a3a3' }
          },
          gridLineColor: '#404040',
          lineColor: '#525252',
          tickColor: '#525252',
          plotLines: [{
            color: '#0ea5e9',
            width: 2,
            value: props.stopLossDistance,
            dashStyle: 'Dash',
            label: {
              text: `Stop-Loss: ${props.stopLossDistance.toFixed(1)}%`,
              style: {
                color: '#0ea5e9',
                fontWeight: 'bold'
              }
            }
          }]
        },
        yAxis: {
          title: {
            text: 'Absolute PnL ($)',
            style: { color: '#a3a3a3' }
          },
          labels: {
            style: { color: '#a3a3a3' }
          },
          gridLineColor: '#404040',
          lineColor: '#525252',
          tickColor: '#525252'
        },
        legend: {
          itemStyle: {
            color: '#fafafa'
          },
          itemHoverStyle: {
            color: '#0ea5e9'
          }
        },
        tooltip: {
          backgroundColor: '#262626',
          borderColor: '#404040',
          style: {
            color: '#fafafa'
          },
          formatter: function() {
            return `
              <b>MAE:</b> ${this.x.toFixed(2)}%<br/>
              <b>PnL:</b> $${this.point.pnl.toFixed(2)}<br/>
              <b>Abs PnL:</b> $${this.y.toFixed(2)}<br/>
              <b>Type:</b> ${this.point.isWinning ? 'Winning' : 'Losing'} Trade
            `
          }
        },
        plotOptions: {
          scatter: {
            marker: {
              radius: 4,
              states: {
                hover: {
                  enabled: true,
                  lineColor: 'rgb(100,100,100)'
                }
              }
            }
          }
        },
        series: [{
          name: 'Winning Trades',
          color: '#22c55e',
          data: winningTrades.map(point => ({
            x: point.x,
            y: point.y,
            pnl: point.pnl,
            isWinning: point.isWinning
          }))
        }, {
          name: 'Losing Trades',
          color: '#ef4444',
          data: losingTrades.map(point => ({
            x: point.x,
            y: point.y,
            pnl: point.pnl,
            isWinning: point.isWinning
          }))
        }],
        credits: {
          enabled: false
        }
      })
    }

    const updateChart = () => {
      if (!chart) return

      // Update the stop-loss line
      chart.xAxis[0].removePlotLine('stopLossLine')
      chart.xAxis[0].addPlotLine({
        id: 'stopLossLine',
        color: '#0ea5e9',
        width: 2,
        value: props.stopLossDistance,
        dashStyle: 'Dash',
        label: {
          text: `Stop-Loss: ${props.stopLossDistance.toFixed(1)}%`,
          style: {
            color: '#0ea5e9',
            fontWeight: 'bold'
          }
        }
      })
    }

    onMounted(() => {
      nextTick(() => {
        createChart()
      })
    })

    watch(() => props.data, () => {
      if (chart) {
        chart.destroy()
      }
      nextTick(() => {
        createChart()
      })
    }, { deep: true })

    watch(() => props.stopLossDistance, () => {
      updateChart()
    })

    return {
      chartRef
    }
  }
}
</script>

<style lang="scss" scoped>
.chart-container {
  .chart {
    height: 400px;
    width: 100%;
  }
}
</style>