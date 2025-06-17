<template>
  <div id="app">
    <div class="app-header">
      <div class="container">
        <div class="logo">
          <h1>TradeStream</h1>
          <span class="subtitle">Stop-Loss Optimizer</span>
        </div>
      </div>
    </div>
    
    <main class="main-content">
      <div class="container">
        <StopLossOptimizer />
      </div>
    </main>
  </div>
</template>

<script>
import StopLossOptimizer from './components/StopLossOptimizer.vue'

export default {
  name: 'App',
  components: {
    StopLossOptimizer
  }
}
</script>

<style lang="scss" scoped>
.app-header {
  background: $background-primary;
  border-bottom: 1px solid $border-primary;
  padding: 1rem 0;
  
  .container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 1rem;
  }
  
  .logo {
    h1 {
      color: $text-primary;
      font-size: 1.5rem;
      font-weight: 600;
      margin: 0;
      margin-bottom: 0.25rem;
    }
    
    .subtitle {
      color: $text-secondary;
      font-size: 0.875rem;
      font-weight: 400;
    }
  }
}

.main-content {
  background: $background-secondary;
  min-height: calc(100vh - 80px);
  padding: 2rem 0;
  
  .container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 1rem;
  }
}
</style>