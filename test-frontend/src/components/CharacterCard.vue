<script setup lang="ts">
import type { Character } from '@/interfaces/Character'

// Define props to receive character data from the parent component
const props = defineProps<{ character: Character }>()
</script>

<template>
  <div class="character-card">
    <!-- Router link to navigate to the character's details page -->
    <router-link :to="`/characters/${character.id}`">
      <img :src="character.image" :alt="character.name" />
      <h3>{{ character.name }}</h3>
      <p>Status: {{ character.status }}</p>
    </router-link>
  </div>
</template>

<style scoped lang="scss">
.character-card {
  background: $white;
  border-radius: 8px;
  padding: 10px;
  text-align: center;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  transition:
    background-color 0.4s ease-in-out,
    transform 0.3s ease-in-out;

  &:hover {
    background-color: $background-color;
    transform: scale(1.05);
  }

  img {
    width: 100%;
    border-radius: 8px;
  }

  h3 {
    margin: 10px 0 5px;
    font-weight: 600;
    line-height: 27px;
  }
  a {
    color: $text-color;
  }
}
</style>
