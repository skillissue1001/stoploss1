<template>
  <div class="slider-container">
    <div class="slider-label">
      <span class="slider-title">Stop-Loss Distance</span>
      <span class="slider-value">{{ modelValue.toFixed(1) }}%</span>
    </div>
    
    <input
      type="range"
      class="slider"
      :min="min"
      :max="max"
      :step="step"
      :value="modelValue"
      @input="updateValue"
    />
    
    <div class="slider-marks">
      <span class="mark">{{ min }}%</span>
      <span class="mark">{{ max }}%</span>
    </div>
  </div>
</template>

<script>
export default {
  name: 'StopLossSlider',
  props: {
    modelValue: {
      type: Number,
      required: true
    },
    min: {
      type: Number,
      default: 1
    },
    max: {
      type: Number,
      default: 70
    },
    step: {
      type: Number,
      default: 0.5
    }
  },
  emits: ['update:modelValue'],
  methods: {
    updateValue(event) {
      const value = parseFloat(event.target.value)
      this.$emit('update:modelValue', value)
    }
  }
}
</script>

<style lang="scss" scoped>
.slider-container {
  .slider-marks {
    display: flex;
    justify-content: space-between;
    margin-top: $spacing-xs;
    
    .mark {
      font-size: $font-size-xs;
      color: $text-tertiary;
    }
  }
}
</style>