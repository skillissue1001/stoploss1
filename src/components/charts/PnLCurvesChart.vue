<template>
  <div class="chart-container">
    <div ref="chartRef" class="chart"></div>
  </div>
</template>

<script>
import { ref, onMounted, watch, nextTick } from 'vue'
import Highcharts from 'highcharts'

export default {
  name: 'PnLCurvesChart',
  props: {
    originalData: {
      type: Array,
      required: true
    },
    simulatedData: {
      type: Array,
      required: true
    }
  },
  setup(props) {
    const chartRef = ref(null)
    let chart = null

    const createChart = () => {
      if (!chartRef.value || !props.originalData.length) return

      chart = Highcharts.chart(chartRef.value, {
        chart: {
          type: 'line',
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
            text: 'Trade Number',
            style: { color: '#a3a3a3' }
          },
          labels: {
            style: { color: '#a3a3a3' }
          },
          gridLineColor: '#404040',
          lineColor: '#525252',
          tickColor: '#525252'
        },
        yAxis: {
          title: {
            text: 'Cumulative PnL ($)',
            style: { color: '#a3a3a3' }
          },
          labels: {
            style: { color: '#a3a3a3' },
            formatter: function() {
              return '$' + Highcharts.numberFormat(this.value, 0)
            }
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
          shared: true,
          formatter: function() {
            let tooltip = `<b>Trade ${this.x}</b><br/>`
            this.points.forEach(point => {
              tooltip += `<span style="color:${point.color}">${point.series.name}</span>: $${Highcharts.numberFormat(point.y, 2)}<br/>`
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
          name: 'Original PnL',
          color: '#a3a3a3',
          data: props.originalData,
          dashStyle: 'Solid'
        }, {
          name: 'Stop-Loss Optimized',
          color: '#0ea5e9',
          data: props.simulatedData,
          dashStyle: 'Solid'
        }],
        credits: {
          enabled: false
        }
      })
    }

    onMounted(() => {
      nextTick(() => {
        createChart()
      })
    })

    watch([() => props.originalData, () => props.simulatedData], () => {
      if (chart) {
        chart.destroy()
      }
      nextTick(() => {
        createChart()
      })
    }, { deep: true })

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