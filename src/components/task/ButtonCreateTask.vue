<template>
  <button :class="[$style.addTaskBtn, $style[format]]" type="button">
    <span :class="$style.plus">+</span>
  </button>
</template>

<script setup>
  defineProps({
    format: {
      type: String,
      required: true,
      validator: value => ['compact', 'large'].includes(value)
    }
  });
</script>

<style module lang="scss">
  @import '../../assets/styles/variables';

  .addTaskBtn {
    width: 100%;
    border: 1px dashed $border-color;
    background: $bg-secondary;
    color: $text-muted;
    border-radius: $border-radius;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: $font-size-lg;
    font-weight: 500;
    cursor: pointer;
    gap: $spacing-sm;
    margin-bottom: $spacing-md;
    outline: none;
    transition:
      border-color 0.18s ease,
      background 0.18s ease,
      color 0.18s ease;

    &:hover {
      border-color: #9ca3af;
      background: #f3f4f6;
      color: #4b5563;
    }
  }

  .compact {
    min-height: 36px;
  }

  .large {
    min-height: 112px;
  }

  .plus {
    font-size: $font-size-2xl;
    line-height: 1;
    font-weight: bold;
    pointer-events: none;
    user-select: none;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .label {
    font-size: $font-size-lg;
    color: $text-secondary;
    font-weight: 500;
    letter-spacing: 0.01em;
    white-space: nowrap;
    pointer-events: none;
  }
</style>
