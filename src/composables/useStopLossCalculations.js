import { ref, computed, watch } from 'vue'

export function useStopLossCalculations(tradeData) {
  const stopLossDistance = ref(10) // Default 10%
  
  const simulatedMetrics = computed(() => {
    if (!tradeData.trades || tradeData.trades.length === 0) {
      return {
        totalPnL: 0,
        winRate: 0,
        avgWin: 0,
        avgLoss: 0,
        totalTrades: 0,
        expectedValue: 0,
        tradesAffected: 0
      }
    }

    const simulatedTrades = tradeData.trades.map(trade => {
      // If MAE exceeds stop-loss distance, simulate the stop-loss
      if (trade.mae_percent > stopLossDistance.value) {
        const pnlWithoutFees = trade.pnl_without_fees
        const updatedPnL = (Math.abs(pnlWithoutFees) * (stopLossDistance.value / trade.mae_percent)) + trade.fees
        
        return {
          ...trade,
          simulated_pnl: -Math.abs(updatedPnL), // Always negative when stopped out
          was_stopped: true
        }
      }
      
      return {
        ...trade,
        simulated_pnl: trade.pnl,
        was_stopped: false
      }
    })

    const totalPnL = simulatedTrades.reduce((sum, trade) => sum + trade.simulated_pnl, 0)
    const winningTrades = simulatedTrades.filter(trade => trade.simulated_pnl > 0)
    const losingTrades = simulatedTrades.filter(trade => trade.simulated_pnl <= 0)
    const tradesAffected = simulatedTrades.filter(trade => trade.was_stopped).length

    return {
      totalPnL,
      winRate: simulatedTrades.length > 0 ? (winningTrades.length / simulatedTrades.length) * 100 : 0,
      avgWin: winningTrades.length > 0 ? winningTrades.reduce((sum, trade) => sum + trade.simulated_pnl, 0) / winningTrades.length : 0,
      avgLoss: losingTrades.length > 0 ? losingTrades.reduce((sum, trade) => sum + trade.simulated_pnl, 0) / losingTrades.length : 0,
      totalTrades: simulatedTrades.length,
      expectedValue: simulatedTrades.length > 0 ? totalPnL / simulatedTrades.length : 0,
      tradesAffected,
      simulatedTrades
    }
  })

  const performanceComparison = computed(() => {
    const original = tradeData.originalMetrics
    const simulated = simulatedMetrics.value
    
    return {
      pnlDifference: simulated.totalPnL - original.totalPnL,
      pnlDifferencePercent: original.totalPnL !== 0 ? ((simulated.totalPnL - original.totalPnL) / Math.abs(original.totalPnL)) * 100 : 0,
      winRateDifference: simulated.winRate - original.winRate,
      expectedValueDifference: simulated.expectedValue - (original.totalPnL / original.totalTrades || 0)
    }
  })

  const chartData = computed(() => {
    if (!tradeData.trades || tradeData.trades.length === 0) {
      return {
        scatterData: [],
        cumulativePnL: [],
        simulatedCumulativePnL: []
      }
    }

    // Scatter plot data for MAE vs PnL
    const scatterData = tradeData.trades.map(trade => ({
      x: trade.mae_percent,
      y: Math.abs(trade.pnl),
      color: trade.is_winning ? '#22c55e' : '#ef4444',
      pnl: trade.pnl,
      fees: trade.fees,
      isWinning: trade.is_winning
    }))

    // Cumulative PnL curves
    let cumulativeOriginal = 0
    let cumulativeSimulated = 0
    
    const cumulativePnL = []
    const simulatedCumulativePnL = []
    const simulated = simulatedMetrics.value.simulatedTrades

    tradeData.trades.forEach((trade, index) => {
      cumulativeOriginal += trade.pnl
      cumulativeSimulated += simulated[index].simulated_pnl
      
      cumulativePnL.push([index + 1, cumulativeOriginal])
      simulatedCumulativePnL.push([index + 1, cumulativeSimulated])
    })

    return {
      scatterData,
      cumulativePnL,
      simulatedCumulativePnL
    }
  })

  const performanceMetricsData = computed(() => {
    // Calculate performance metrics across different stop-loss distances
    const distances = []
    const expectedValues = []
    const winRates = []
    
    for (let distance = 1; distance <= 70; distance += 1) {
      const metrics = calculateMetricsForDistance(distance)
      distances.push(distance)
      expectedValues.push(metrics.expectedValue)
      winRates.push(metrics.winRate)
    }
    
    return {
      distances,
      expectedValues,
      winRates
    }
  })

  const calculateMetricsForDistance = (distance) => {
    if (!tradeData.trades || tradeData.trades.length === 0) {
      return { expectedValue: 0, winRate: 0 }
    }

    const simulatedTrades = tradeData.trades.map(trade => {
      if (trade.mae_percent > distance) {
        const pnlWithoutFees = trade.pnl_without_fees
        const updatedPnL = (Math.abs(pnlWithoutFees) * (distance / trade.mae_percent)) + trade.fees
        return -Math.abs(updatedPnL)
      }
      return trade.pnl
    })

    const totalPnL = simulatedTrades.reduce((sum, pnl) => sum + pnl, 0)
    const winningTrades = simulatedTrades.filter(pnl => pnl > 0).length
    
    return {
      expectedValue: simulatedTrades.length > 0 ? totalPnL / simulatedTrades.length : 0,
      winRate: simulatedTrades.length > 0 ? (winningTrades / simulatedTrades.length) * 100 : 0
    }
  }

  return {
    stopLossDistance,
    simulatedMetrics,
    performanceComparison,
    chartData,
    performanceMetricsData
  }
}