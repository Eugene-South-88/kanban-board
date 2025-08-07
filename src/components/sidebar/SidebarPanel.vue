<template>
  <aside :class="$style.sidebar">
    <section :class="$style.sectionTitle">Мои задачи</section>
    <nav>
      <ul :class="$style.list">
        <router-link to="/" custom v-slot="{ navigate }">
          <li
            :class="[$style.item, route.path === '/' ? $style.active : $style.disabled]"
            @click="navigate"
          >
            Список задач
          </li>
        </router-link>
        <router-link to="/kanban" custom v-slot="{ navigate }">
          <li
            :class="[$style.item, route.path === '/kanban' ? $style.active : $style.disabled]"
            @click="navigate"
          >
            Канбан-доска
          </li>
        </router-link>
      </ul>
    </nav>
    <div :class="$style.sidebarInfo">
      <div>
        На сегодня: <span :class="$style.blue">{{ countToday }}</span>
      </div>
      <div>
        На завтра: <span :class="$style.blue">{{ countTomorrow }}</span>
      </div>
    </div>

    <div :class="$style.sidebarFooter">
      <div>{{ currentDate }}</div>
      <div>{{ currentTime }}</div>
    </div>
  </aside>
</template>

<script setup>
  import { ref, computed, onMounted, onUnmounted } from 'vue';
  import { useRoute } from 'vue-router';
  import { useStore } from 'vuex';

  const route = useRoute();
  const store = useStore();

  const countToday = computed(() => store.getters.countToday);
  const countTomorrow = computed(() => store.getters.countTomorrow);

  const currentDate = ref('');
  const currentTime = ref('');

  const updateDateTime = () => {
    const now = new Date();
    currentDate.value = now
      .toLocaleDateString('ru-RU', {
        day: '2-digit',
        month: 'long',
        year: 'numeric'
      })
      .replace(/\sг\.$/, '');
    currentTime.value = now.toLocaleTimeString('ru-RU', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    });
  };

  onMounted(() => {
    updateDateTime();
    if (store.dispatch && store._actions && store._actions.updateNow) {
      store.dispatch('updateNow');
      const id = setInterval(() => {
        updateDateTime();
        store.dispatch('updateNow');
      }, 60000);
      onUnmounted(() => clearInterval(id));
    } else {
      const id = setInterval(updateDateTime, 60000);
      onUnmounted(() => clearInterval(id));
    }
  });
</script>

<style module lang="scss">
  @import '../../assets/styles/variables';

  .sidebar {
    min-width: 220px;
    background: $bg-accent;
    padding: $spacing-2xl 0 0 0;
    display: flex;
    flex-direction: column;
    height: 100vh;
    box-sizing: border-box;
  }

  .sectionTitle {
    font-size: $font-size-lg;
    color: $text-secondary;
    font-weight: bold;
    margin-bottom: $spacing-lg;
    text-align: center;
    letter-spacing: 0.02em;
  }

  .list {
    list-style: none;
    padding: 0;
    margin-bottom: $spacing-2xl;
  }

  .item {
    padding: $spacing-md $spacing-xl;
    margin-bottom: $spacing-sm;
    border-radius: $border-radius 0 0 $border-radius;
    font-size: $font-size-base;
    cursor: pointer;
    color: $text-color;
  }

  .active {
    background: $primary-color;
    color: $text-color;
    font-weight: bold;
  }

  .disabled {
    color: $text-disabled;
    background: none;
  }

  .sidebarInfo {
    font-size: $font-size-base;
    color: $text-secondary;
    margin-bottom: auto;
    padding-left: $spacing-xl;
    line-height: 1.7;
  }

  .blue {
    color: $primary-color;
    font-weight: bold;
  }

  .sidebarFooter {
    font-size: $font-size-sm;
    color: $text-secondary;
    margin-top: $spacing-2xl;
    text-align: center;
    padding-bottom: $spacing-lg;
  }
</style>
