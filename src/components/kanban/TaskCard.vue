<script setup>
  import { computed } from 'vue';
  import { ru } from 'date-fns/locale';
  import { format } from 'date-fns';

  const props = defineProps({
    task: {
      type: Object,
      required: true
    },
    column: {
      type: String,
      default: null
    }
  });

  const emit = defineEmits(['update:stage']);

  const formattedDate = computed(() => {
    const date = new Date(props.task.date);

    if (props.column === 'later') {
      return format(date, 'dd.MM', { locale: ru });
    } else {
      return format(date, 'dd.MM.yyyy HH:mm', { locale: ru });
    }
  });

  const isChecked = computed(() => props.task.stage === 1);

  function toggleStage() {
    emit('update:stage', isChecked.value ? 0 : 1);
  }
</script>

<template>
  <div
    :class="[$style.card, task.stage === 0 && $style.blue, task.stage === 1 && $style.green]"
    draggable="true"
  >
    <div :class="$style.checkboxWrapper">
      <input type="checkbox" :checked="isChecked" @change="toggleStage" aria-label="Выполнено" />
    </div>

    <div :class="$style.content">
      <div :class="[$style.title, task.stage === 1 && $style.completed]">
        {{ task.title }}
      </div>

      <div v-if="task.stage !== 1" :class="$style.time">
        {{ formattedDate }}
      </div>
    </div>
  </div>
</template>

<style module lang="scss">
  @import '../../assets/styles/variables';

  .card {
    cursor: grab;
    height: 100px;
    background: $task-bg;
    display: flex;
    align-items: center;
    gap: 12px;
    min-width: 112px;
    padding: 14px 18px 12px 14px;
    border-radius: 6px;
    font-size: 14px;
    position: relative;
    box-shadow: 0 1px 4px rgba(0, 0, 0, 0.04);
    transition: all 0.2s ease;

    &:active {
      cursor: grabbing;
    }

    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 15px rgba(104, 170, 132, 0.15);
    }
  }

  .blue {
    background: $task-bg;
  }

  .green {
    background: $task-bg-done;
  }

  .checkboxWrapper {
    display: flex;
    align-items: flex-start;
    flex-shrink: 0;
    margin-right: 6px;
  }

  input[type='checkbox'] {
    accent-color: $primary-color;
    width: 19px;
    height: 19px;
    cursor: pointer;
    margin-top: 2px;
    transition: transform 0.1s ease;

    &:hover {
      transform: scale(1.05);
    }

    &:disabled {
      cursor: not-allowed;
      opacity: 0.65;
    }
  }

  .content {
    display: flex;
    flex-direction: column;
    justify-content: center;
    flex: 1;
  }

  .title {
    font-size: 20px;
    font-weight: 500;
    color: $text-color;
    line-height: 1.3;
    transition: all 0.2s ease;
  }

  .completed {
    text-decoration: line-through;
    color: $text-muted;
    opacity: 0.8;
  }

  .time {
    color: $text-muted;
    font-size: 12px;
    margin-top: 2px;
    font-weight: 500;
    transition: all 0.2s ease;
  }
</style>
