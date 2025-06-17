<template>
  <div class="stop-loss-optimizer">
    <!-- Loading State -->
    <div v-if="loading" class="loading">
      <div class="spinner"></div>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="error-message">
      <p>{{ error }}</p>
      <button @click="retryFetch" class="btn btn-primary btn-sm mt-md">
        Retry
      </button>
    </div>

    <!-- Main Content -->
    <div v-else-if="tradeData.trades.length > 0" class="optimizer-content">
      <!-- Controls Section -->
      <div class="card mb-xl">
        <div class="card-header">
          <h2 class="card-title">Stop-Loss Configuration</h2>
          <p class="card-subtitle">Adjust the stop-loss distance to see how it affects your trading performance</p>
        </div>
        
        <StopLossSlider 
          v-model="stopLossDistance" 
          :min="1" 
          :max="70" 
          :step="0.5"
        />
      </div>

      <!-- Metrics Overview -->
      <div class="card mb-xl">
        <div class="card-header">
          <h2 class="card-title">Performance Comparison</h2>
          <p class="card-subtitle">Original vs Stop-Loss Optimized Performance</p>
        </div>
        
        <MetricsPanel 
          :original="tradeData.originalMetrics"
          :simulated="simulatedMetrics"
          :comparison="performanceComparison"
        />
      </div>

      <!-- Charts Grid -->
      <div class="grid grid-2 mb-xl">
        <!-- MAE Scatter Chart -->
        <div class="card">
          <div class="card-header">
            <h3 class="card-title">MAE vs PnL Analysis</h3>
            <p class="card-subtitle">Maximum Adverse Excursion vs Profit/Loss</p>
          </div>
          <MAEScatterChart 
            :data="chartData.scatterData"
            :stop-loss-distance="stopLossDistance"
          />
        </div>

        <!-- Performance Metrics Chart -->
        <div class="card">
          <div class="card-header">
            <h3 class="card-title">Optimization Curve</h3>
            <p class="card-subtitle">Expected Value vs Stop-Loss Distance</p>
          </div>
          <PerformanceMetricsChart 
            :data="performanceMetricsData"
            :current-distance="stopLossDistance"
          />
        </div>
      </div>

      <!-- PnL Curves Chart -->
      <div class="card">
        <div class="card-header">
          <h3 class="card-title">Cumulative PnL Comparison</h3>
          <p class="card-subtitle">Original vs Stop-Loss Optimized Cumulative Performance</p>
        </div>
        <PnLCurvesChart 
          :original-data="chartData.cumulativePnL"
          :simulated-data="chartData.simulatedCumulativePnL"
        />
      </div>
    </div>

    <!-- Empty State -->
    <div v-else class="card text-center">
      <div class="card-header">
        <h2 class="card-title">No Data Available</h2>
        <p class="card-subtitle">Click the button below to load sample trading data</p>
      </div>
      <button @click="loadSampleData" class="btn btn-primary">
        Load Sample Data
      </button>
    </div>
  </div>
</template>

<script>
import { onMounted } from 'vue'
import { useTradeData } from '../composables/useTradeData.js'
import { useStopLossCalculations } from '../composables/useStopLossCalculations.js'
import StopLossSlider from './controls/StopLossSlider.vue'
import MetricsPanel from './display/MetricsPanel.vue'
import MAEScatterChart from './charts/MAEScatterChart.vue'
import PnLCurvesChart from './charts/PnLCurvesChart.vue'
import PerformanceMetricsChart from './charts/PerformanceMetricsChart.vue'

export default {
  name: 'StopLossOptimizer',
  components: {
    StopLossSlider,
    MetricsPanel,
    MAEScatterChart,
    PnLCurvesChart,
    PerformanceMetricsChart
  },
  setup() {
    const { loading, error, state: tradeData, fetchData } = useTradeData()
    const { 
      stopLossDistance, 
      simulatedMetrics, 
      performanceComparison, 
      chartData,
      performanceMetricsData
    } = useStopLossCalculations(tradeData)

    const loadSampleData = () => {
      fetchData()
    }

    const retryFetch = () => {
      fetchData()
    }

    onMounted(() => {
      loadSampleData()
    })

    return {
      loading,
      error,
      tradeData,
      stopLossDistance,
      simulatedMetrics,
      performanceComparison,
      chartData,
      performanceMetricsData,
      loadSampleData,
      retryFetch
    }
  }
}
</script>

<style lang="scss" scoped>
.stop-loss-optimizer {
  .optimizer-content {
    animation: fadeIn 0.5s ease-in-out;
  }
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>