<template>
	<div :class="[$style.taskItem, isChecked && $style.done]" @click="handleTaskClick">
    <span :class="$style.check" @click.stop>
      <input type="checkbox" v-model="isChecked" />
    </span>

		<span
				v-if="!isEditing"
				:class="[$style.title, isChecked && $style.strike]"
				@click.stop="startEditing"
				tabindex="0"
				@keydown.enter="startEditing"
				@keydown.space.prevent="startEditing"
				role="button"
				aria-label="Редактировать название задачи"
				:title="task.title"
		>
      {{ task.title }}
    </span>

		<div v-else :class="$style.editWrapper" @click.stop>
			<input
					v-model="editTitle"
					:class="$style.titleInput"
					placeholder="Введите заголовок"
					@keydown.enter.prevent="stopEditing"
					@keydown.esc="cancelEditing"
					ref="inputRef"
					type="text"
					aria-label="Редактировать название задачи"
					maxlength="100"
					@click.stop
					@blur="stopEditing"
			/>

			<button
					type="button"
					:class="$style.saveBtn"
					@click.stop="stopEditing"
					:disabled="isSaving"
					aria-label="Сохранить изменения"
			>
				{{ isSaving ? 'Сохранение...' : 'Сохранить' }}
			</button>
		</div>

		<span v-if="task.stage !== 1" :class="$style.time" @click.stop>{{ formattedDate }}</span>
	</div>
</template>

<script setup>
import { ref, defineProps, defineEmits, watch, nextTick, onUnmounted, computed } from 'vue'
import { format } from 'date-fns'
import { ru } from 'date-fns/locale'

const props = defineProps({
	task: {
		type: Object,
		required: true,
		validator: task => {
			return task && typeof task.title === 'string' && typeof task.stage === 'number'
		}
	}
})

const formattedDate = computed(() => {
	return format(new Date(props.task.date), 'dd.MM.yyyy HH:mm', { locale: ru })
})

const emit = defineEmits(['update:stage', 'update:title'])

const isChecked = ref(Boolean(props.task.stage))
const isEditing = ref(false)
const editTitle = ref(props.task.title)
const inputRef = ref(null)
const isSaving = ref(false)

const debounce = (func, delay) => {
	let timeoutId
	return (...args) => {
		clearTimeout(timeoutId)
		timeoutId = setTimeout(() => func.apply(this, args), delay)
	}
}

const debouncedSave = debounce(() => {
	const trimmedTitle = editTitle.value.trim()

	if (trimmedTitle && trimmedTitle !== props.task.title) {
		isSaving.value = true

		emit('update:title', trimmedTitle)

		new Promise(resolve => setTimeout(resolve, 200))
				.then(() => {
					isSaving.value = false
				})
				.catch(() => {
					editTitle.value = props.task.title
					isSaving.value = false
				})
	}
}, 500)

const handleTaskClick = () => {
	if (isEditing.value) {
		stopEditing()
	}
}

watch(isChecked, val => {
	emit('update:stage', val ? 1 : 0)
})

watch(editTitle, debouncedSave)

watch(
		() => props.task.title,
		newTitle => {
			if (!isEditing.value) {
				editTitle.value = newTitle
			}
		}
)

const startEditing = () => {
	isEditing.value = true
	editTitle.value = props.task.title
	nextTick(() => {
		if (inputRef.value) {
			inputRef.value.focus()
			inputRef.value.select()
		}
	})
}

const stopEditing = () => {
	if (isSaving.value) return

	const trimmedTitle = editTitle.value.trim()

	if (!trimmedTitle) {
		editTitle.value = props.task.title
	} else if (trimmedTitle !== props.task.title) {
		emit('update:title', trimmedTitle)
	}

	isEditing.value = false
}

const cancelEditing = () => {
	editTitle.value = props.task.title
	isEditing.value = false
}

onUnmounted(() => {
	if (debouncedSave.cancel) {
		debouncedSave.cancel()
	}
})
</script>

<style module lang="scss">
@import '../../assets/styles/variables';

.taskItem {
	display: flex;
	align-items: center;
	background: $task-bg;
	color: $text-color;
	border-radius: $border-radius;
	margin-bottom: $spacing-lg;
	padding: $spacing-lg $spacing-xl;
	box-shadow: $box-shadow;
	cursor: default;
}

.done {
	background: $task-bg-done;
}

.check {
	margin-right: $spacing-xl;
	display: flex;
	align-items: center;
	cursor: default;
}

input[type='checkbox'] {
	accent-color: $primary-color;
	width: 20px;
	height: 20px;
	margin: 0;
	cursor: pointer;
}

.title {
	flex: 1 1 auto;
	font-size: $font-size-lg;
	color: $text-color;
	font-weight: 500;
	cursor: pointer;
	user-select: text;
	outline: none;
	white-space: nowrap;
	overflow: hidden;
	text-overflow: ellipsis;
	max-width: 100%;

	&:focus {
		outline: 2px solid $primary-color;
		outline-offset: 2px;
	}
}

.editWrapper {
	flex: 1;
	display: flex;
	align-items: center;
}

.titleInput {
	flex: 1 1 auto;
	font-size: $font-size-lg;
	padding: 4px $spacing-sm;
	border-radius: 6px;
	border: 1.5px solid $primary-color;
	outline: none;
	color: $text-color;
	font-weight: 500;
	box-sizing: border-box;
	margin-right: $spacing-md;
	cursor: text;
}

.saveBtn {
	background-color: $primary-color;
	border: none;
	color: white;
	padding: 6px $spacing-lg;
	border-radius: 6px;
	font-size: $font-size-sm;
	font-weight: 600;
	cursor: pointer;
	white-space: nowrap;

	&:disabled {
		opacity: 0.7;
		cursor: not-allowed;
	}

	&:hover:not(:disabled),
	&:focus:not(:disabled) {
		background-color: $primary-color-hover;
		outline: none;
	}
}

.time {
	color: $text-muted;
	font-size: $font-size-sm;
	min-width: 100px;
	text-align: right;
	margin-left: $spacing-xl;
}

.strike {
	text-decoration: line-through;
	color: $text-muted;
}
</style>
