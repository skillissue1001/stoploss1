<template>
  <div class="chart-container">
    <div ref="chartRef" class="chart"></div>
  </div>
</template>

<script>
import { ref, onMounted, watch, nextTick } from 'vue'
import Highcharts from 'highcharts'

export default {
  name: 'PerformanceMetricsChart',
  props: {
    data: {
      type: Object,
      required: true
    },
    currentDistance: {
      type: Number,
      required: true
    }
  },
  setup(props) {
    const chartRef = ref(null)
    let chart = null

    const createChart = () => {
      if (!chartRef.value || !props.data.distances.length) return

      // Find optimal point (highest expected value)
      const maxExpectedValue = Math.max(...props.data.expectedValues)
      const optimalIndex = props.data.expectedValues.indexOf(maxExpectedValue)
      const optimalDistance = props.data.distances[optimalIndex]

      chart = Highcharts.chart(chartRef.value, {
        chart: {
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
            text: 'Stop-Loss Distance (%)',
            style: { color: '#a3a3a3' }
          },
          labels: {
            style: { color: '#a3a3a3' }
          },
          gridLineColor: '#404040',
          lineColor: '#525252',
          tickColor: '#525252',
          plotLines: [{
            id: 'currentDistance',
            color: '#0ea5e9',
            width: 2,
            value: props.currentDistance,
            dashStyle: 'Dash',
            label: {
              text: `Current: ${props.currentDistance.toFixed(1)}%`,
              style: {
                color: '#0ea5e9',
                fontWeight: 'bold'
              }
            }
          }, {
            id: 'optimalDistance',
            color: '#22c55e',
            width: 2,
            value: optimalDistance,
            dashStyle: 'Dot',
            label: {
              text: `Optimal: ${optimalDistance.toFixed(1)}%`,
              style: {
                color: '#22c55e',
                fontWeight: 'bold'
              }
            }
          }]
        },
        yAxis: [{
          title: {
            text: 'Expected Value ($)',
            style: { color: '#a3a3a3' }
          },
          labels: {
            style: { color: '#a3a3a3' },
            formatter: function() {
              return '$' + Highcharts.numberFormat(this.value, 2)
            }
          },
          gridLineColor: '#404040',
          lineColor: '#525252',
          tickColor: '#525252'
        }, {
          title: {
            text: 'Win Rate (%)',
            style: { color: '#f59e0b' }
          },
          labels: {
            style: { color: '#f59e0b' },
            formatter: function() {
              return this.value.toFixed(1) + '%'
            }
          },
          opposite: true,
          gridLineColor: 'transparent'
        }],
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
          shared: true,
          formatter: function() {
            let tooltip = `<b>Stop-Loss: ${this.x.toFixed(1)}%</b><br/>`
            this.points.forEach(point => {
              if (point.series.name === 'Expected Value') {
                tooltip += `<span style="color:${point.color}">Expected Value</span>: $${point.y.toFixed(2)}<br/>`
              } else {
                tooltip += `<span style="color:${point.color}">Win Rate</span>: ${point.y.toFixed(1)}%<br/>`
              }
            })
            return tooltip
          }
        },
        plotOptions: {
          line: {
            marker: {
              enabled: false,
              states: {
                hover: {
                  enabled: true,
                  radius: 4
                }
              }
            },
            lineWidth: 2
          }
        },
        series: [{
          name: 'Expected Value',
          yAxis: 0,
          color: '#0ea5e9',
          data: props.data.distances.map((distance, index) => [distance, props.data.expectedValues[index]])
        }, {
          name: 'Win Rate',
          yAxis: 1,
          color: '#f59e0b',
          data: props.data.distances.map((distance, index) => [distance, props.data.winRates[index]])
        }],
        credits: {
          enabled: false
        }
      })
    }

    const updateChart = () => {
      if (!chart) return

      // Update current distance line
      chart.xAxis[0].removePlotLine('currentDistance')
      chart.xAxis[0].addPlotLine({
        id: 'currentDistance',
        color: '#0ea5e9',
        width: 2,
        value: props.currentDistance,
        dashStyle: 'Dash',
        label: {
          text: `Current: ${props.currentDistance.toFixed(1)}%`,
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

    watch(() => props.currentDistance, () => {
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