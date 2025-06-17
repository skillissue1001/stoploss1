import { ref, reactive } from 'vue'
import ApiService from '../services/api.js'

export function useTradeData() {
  const loading = ref(false)
  const error = ref(null)
  const rawData = ref(null)
  
  const state = reactive({
    trades: [],
    originalMetrics: {
      totalPnL: 0,
      winRate: 0,
      avgWin: 0,
      avgLoss: 0,
      totalTrades: 0
    }
  })

  const fetchData = async (uid = 'test_data', sessionId = 'sesh-93241', testError = false) => {
    loading.value = true
    error.value = null
    
    try {
      const data = await ApiService.getStopLossData(
        uid, 
        sessionId, 
        testError ? 1 : null
      )
      
      rawData.value = data
      processTradeData(data)
    } catch (err) {
      error.value = err.message
      console.error('Error fetching trade data:', err)
    } finally {
      loading.value = false
    }
  }

  const processTradeData = (data) => {
    if (!data || !Array.isArray(data)) {
      throw new Error('Invalid data format received')
    }

    // Process trades and calculate metrics
    const trades = data.map(trade => ({
      id: trade.id || Math.random().toString(36).substr(2, 9),
      pnl: parseFloat(trade.pnl) || 0,
      fees: parseFloat(trade.fees) || 0,
      mae_percent: parseFloat(trade.mae_percent) || 0,
      pnl_without_fees: parseFloat(trade.pnl) - parseFloat(trade.fees || 0),
      is_winning: (parseFloat(trade.pnl) || 0) > 0
    }))

    state.trades = trades
    
    // Calculate original metrics
    const totalPnL = trades.reduce((sum, trade) => sum + trade.pnl, 0)
    const winningTrades = trades.filter(trade => trade.is_winning)
    const losingTrades = trades.filter(trade => !trade.is_winning)
    
    state.originalMetrics = {
      totalPnL,
      winRate: trades.length > 0 ? (winningTrades.length / trades.length) * 100 : 0,
      avgWin: winningTrades.length > 0 ? winningTrades.reduce((sum, trade) => sum + trade.pnl, 0) / winningTrades.length : 0,
      avgLoss: losingTrades.length > 0 ? losingTrades.reduce((sum, trade) => sum + trade.pnl, 0) / losingTrades.length : 0,
      totalTrades: trades.length
    }
  }

  return {
    loading,
    error,
    rawData,
    state,
    fetchData
  }
}