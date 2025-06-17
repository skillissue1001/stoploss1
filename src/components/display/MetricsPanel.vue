<template>
  <div class="metrics-panel">
    <div class="metric-item">
      <div class="metric-value" :class="{ positive: original.totalPnL > 0, negative: original.totalPnL < 0 }">
        ${{ formatNumber(original.totalPnL) }}
      </div>
      <div class="metric-label">Original PnL</div>
    </div>
    
    <div class="metric-item">
      <div class="metric-value" :class="{ positive: simulated.totalPnL > 0, negative: simulated.totalPnL < 0 }">
        ${{ formatNumber(simulated.totalPnL) }}
      </div>
      <div class="metric-label">Simulated PnL</div>
    </div>
    
    <div class="metric-item">
      <div class="metric-value" :class="{ positive: comparison.pnlDifference > 0, negative: comparison.pnlDifference < 0 }">
        {{ comparison.pnlDifference > 0 ? '+' : '' }}${{ formatNumber(comparison.pnlDifference) }}
      </div>
      <div class="metric-label">Difference</div>
    </div>
    
    <div class="metric-item">
      <div class="metric-value">
        {{ original.winRate.toFixed(1) }}%
      </div>
      <div class="metric-label">Original Win Rate</div>
    </div>
    
    <div class="metric-item">
      <div class="metric-value">
        {{ simulated.winRate.toFixed(1) }}%
      </div>
      <div class="metric-label">Simulated Win Rate</div>
    </div>
    
    <div class="metric-item">
      <div class="metric-value" :class="{ positive: comparison.winRateDifference > 0, negative: comparison.winRateDifference < 0 }">
        {{ comparison.winRateDifference > 0 ? '+' : '' }}{{ comparison.winRateDifference.toFixed(1) }}%
      </div>
      <div class="metric-label">Win Rate Change</div>
    </div>
    
    <div class="metric-item">
      <div class="metric-value">
        {{ simulated.tradesAffected }}
      </div>
      <div class="metric-label">Trades Affected</div>
    </div>
    
    <div class="metric-item">
      <div class="metric-value" :class="{ positive: simulated.expectedValue > 0, negative: simulated.expectedValue < 0 }">
        ${{ formatNumber(simulated.expectedValue) }}
      </div>
      <div class="metric-label">Expected Value</div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'MetricsPanel',
  props: {
    original: {
      type: Object,
      required: true
    },
    simulated: {
      type: Object,
      required: true
    },
    comparison: {
      type: Object,
      required: true
    }
  },
  methods: {
    formatNumber(value) {
      if (Math.abs(value) >= 1000000) {
        return (value / 1000000).toFixed(2) + 'M'
      } else if (Math.abs(value) >= 1000) {
        return (value / 1000).toFixed(1) + 'K'
      } else {
        return value.toFixed(2)
      }
    }
  }
}
</script>