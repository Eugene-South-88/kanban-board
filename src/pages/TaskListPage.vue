<script setup>
import { onMounted, computed } from 'vue'
import { useStore } from 'vuex'
import ButtonCreateTask from '../components/task/ButtonCreateTask.vue'
import TaskItem from '../components/task/TaskItem.vue'

const store = useStore()

const tasks = computed(() => store.getters.allTasks)
const isLoading = computed(() => store.getters.isLoading)
const error = computed(() => store.getters.error)

onMounted(() => {
	store.dispatch('fetchTasks')
})

const getRandomDate = () => {
	const today = new Date()
	const randomDays = Math.floor(Math.random() * 8)

	const randomDate = new Date(today)
	randomDate.setDate(today.getDate() + randomDays)

	const randomHour = Math.floor(Math.random() * 11) + 8
	const randomMinute = Math.floor(Math.random() * 60)

	randomDate.setHours(randomHour, randomMinute, 0, 0)
	return randomDate.toISOString()
}

const createTask = () => {
	store.dispatch('createTask', {
		title: 'Новая задача',
		stage: 0,
		date: getRandomDate()
	})
}

const updateTask = (id, changes) => {
	store.dispatch('updateTask', { id, changes })
}

const retryFetch = () => {
	store.dispatch('fetchTasks')
}

const sortedTasks = computed(() =>
		tasks.value.slice().sort((a, b) => b.date.localeCompare(a.date))
)
</script>

<template>
	<main :class="$style.taskArea">
		<div v-if="isLoading" class="loading">Загрузка задач...</div>

		<div v-else-if="error" class="error">
			Ошибка: {{ error }}
			<button @click="retryFetch">Попробовать снова</button>
		</div>

		<template v-else>
			<TaskItem
					v-for="task in sortedTasks"
					:key="task.id"
					:task="task"
					@update:title="newTitle => updateTask(task.id, { title: newTitle })"
					@update:stage="val => updateTask(task.id, { stage: val })"
			/>

			<ButtonCreateTask format="compact" @click="createTask" />
		</template>
	</main>
</template>

<style module lang="scss">
@import '../assets/styles/variables';

.taskArea {
	flex: 1 1 auto;
	padding: $spacing-2xl $spacing-2xl $spacing-2xl $spacing-xl;
	min-width: 0;
	overflow-y: auto;
	scrollbar-gutter: stable;

	&::-webkit-scrollbar {
		width: 6px;
	}

	&::-webkit-scrollbar-track {
		background: transparent;
	}

	&::-webkit-scrollbar-thumb {
		background: $text-muted;
		border-radius: 3px;

		&:hover {
			background: $text-secondary;
		}
	}
}

.loading,
.error {
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	height: 50vh;
	font-size: $font-size-lg;
	color: $text-color;

	button {
		margin-top: $spacing-md;
		background: $primary-color;
		color: white;
		border: none;
		padding: $spacing-md $spacing-lg;
		border-radius: $border-radius;
		cursor: pointer;

		&:hover {
			background: $primary-color-hover;
		}
	}
}
</style>
