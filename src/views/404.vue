<template>
  <div class="error-page">
    <h1>
      404 Страница не найдена
    </h1>

    <div>
      <router-link :to="{ name: 'home' }" class="base-link">
        На главную
      </router-link>
    </div>
  </div>
</template>

<script>
export default {
  name: 'client-error-page'
};
</script>
