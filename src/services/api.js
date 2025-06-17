import axios from 'axios'

const API_BASE_URL = 'https://us-central1-tradestream-cloud.cloudfunctions.net'

class ApiService {
  constructor() {
    this.client = axios.create({
      baseURL: API_BASE_URL,
      timeout: 30000,
      headers: {
        'Content-Type': 'application/json'
      }
    })
  }

  async getStopLossData(uid = 'test_data', sessionId = 'sesh-93241', error = null) {
    try {
      const params = {
        uid,
        session_id: sessionId
      }
      
      if (error) {
        params.error = error
      }

      const response = await this.client.get('/stoploss-optimizooor', { params })
      return response.data
    } catch (error) {
      console.error('API Error:', error)
      throw new Error(error.response?.data?.message || 'Failed to fetch stop-loss data')
    }
  }
}

export default new ApiService()