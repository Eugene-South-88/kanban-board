<script setup>
import { onMounted, computed } from 'vue'
import { useStore } from 'vuex'
import ButtonCreateTask from '../components/task/ButtonCreateTask.vue'
import COLUMNS_KANBAN from '../constants/taskKanbanColumns.js'
import TaskCard from "../components/kanban/TaskCard.vue";

const store = useStore()
const columns = COLUMNS_KANBAN

const tasksByColumn = computed(() => store.getters.tasksByColumn)
const isLoading = computed(() => store.getters.isLoading)
const error = computed(() => store.getters.error)

onMounted(() => {
	store.dispatch('fetchTasks')
})

const getDateForColumn = columnKey => {
	switch (columnKey) {
		case 'today':
			return new Date().toISOString().slice(0, 10) + 'T09:00:00.000Z'
		case 'tomorrow': {
			const tomorrow = new Date()
			tomorrow.setDate(tomorrow.getDate() + 1)
			return tomorrow.toISOString().slice(0, 10) + 'T09:00:00.000Z'
		}
		default: {
			const dayAfterTomorrow = new Date()
			dayAfterTomorrow.setDate(dayAfterTomorrow.getDate() + 2)
			return dayAfterTomorrow.toISOString().slice(0, 10) + 'T09:00:00.000Z'
		}
	}
}

const createTask = columnKey => {
	store.dispatch('createTask', {
		title: 'Новая задача',
		stage: 0,
		date: getDateForColumn(columnKey)
	})
}

const updateTask = (id, changes) => {
	store.dispatch('updateTask', { id, changes })
}

const handleDragStart = (event, task) => {
	event.dataTransfer.setData('application/json', JSON.stringify(task))
	event.dataTransfer.effectAllowed = 'move'
}

const handleDragOver = event => {
	event.preventDefault()
	event.dataTransfer.dropEffect = 'move'
}

const handleDrop = (event, targetColumnKey) => {
	event.preventDefault()

	const taskData = JSON.parse(event.dataTransfer.getData('application/json'))
	const newDate = getDateForColumn(targetColumnKey)

	updateTask(taskData.id, { date: newDate })
}

const handleDragEnter = event => {
	event.preventDefault()
}

const handleDragLeave = event => {
	event.preventDefault()
}

const retryFetch = () => {
	store.dispatch('fetchTasks')
}
</script>

<template>
	<div v-if="isLoading" class="loading">
		<p>Загрузка задач...</p>
	</div>

	<div v-else-if="error" class="error">
		<p>Ошибка: {{ error }}</p>
		<button @click="retryFetch">Попробовать снова</button>
	</div>

	<div v-else :class="$style.kanbanBoard">
		<div
				v-for="col in columns"
				:key="col.key"
				:class="$style.kanbanColumn"
				@dragover="handleDragOver"
				@drop="event => handleDrop(event, col.key)"
				@dragenter="handleDragEnter"
				@dragleave="handleDragLeave"
		>
			<div :class="$style.kanbanColumnHeader">{{ col.label }}</div>

			<div
					:class="$style.kanbanColumnTasks"
					@dragover="handleDragOver"
					@drop="event => handleDrop(event, col.key)"
			>
				<TaskCard
						v-for="task in tasksByColumn[col.key]"
						:key="task.id"
						:task="task"
						:column="col.key"
						:draggable="true"
						@dragstart="event => handleDragStart(event, task)"
						@update:stage="val => updateTask(task.id, { stage: val })"
				/>

				<ButtonCreateTask format="large" @click="createTask(col.key)" />
			</div>
		</div>
	</div>
</template>

<style module lang="scss">
@import '../assets/styles/variables';

.kanbanBoard {
	display: flex;
	gap: $spacing-2xl;
	background: $bg-primary;
	padding: $spacing-xl;
	width: 100vw;
	box-sizing: border-box;
	height: 100vh;
}

.kanbanColumn {
	border-radius: $border-radius;
	padding: $spacing-lg;
	display: flex;
	flex-direction: column;
	flex: 1 1 0;
	min-width: 0;
	height: calc(100vh - 48px);

	&.dragOver {
		background-color: rgba(104, 170, 132, 0.1);
	}
}

.kanbanColumnHeader {
	font-weight: 700;
	margin-bottom: $spacing-md;
	font-size: $font-size-lg;
	flex-shrink: 0;
}

.kanbanColumnTasks {
	display: flex;
	flex-direction: column;
	gap: $spacing-md;
	flex: 1;
	overflow-y: auto;
	scrollbar-gutter: stable;
	padding-right: 4px;
	border-radius: 6px;
	min-height: 200px;

	&::-webkit-scrollbar {
		width: 6px;
	}

	&::-webkit-scrollbar-track {
		background: transparent;
	}

	&::-webkit-scrollbar-thumb {
		background: rgba(0, 0, 0, 0.2);
		border-radius: 3px;

		&:hover {
			background: rgba(0, 0, 0, 0.3);
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

	p {
		font-size: $font-size-lg;
		color: $text-color;
		margin-bottom: $spacing-lg;
	}

	button {
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
