<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import axios from 'axios'
import type { Character } from '@/interfaces/Character'

const route = useRoute()
const character = ref<Character | null>(null)
const loading = ref(false)
const error = ref('')

// Function to fetch character details from the API
const fetchCharacterDetail = async () => {
  loading.value = true
  try {
    const response = await axios.get(`https://rickandmortyapi.com/api/character/${route.params.id}`)
    character.value = response.data
  } catch (err) {
    error.value = 'Error loading character details.'
  } finally {
    loading.value = false
  }
}

// Fetch data when the component is mounted
onMounted(fetchCharacterDetail)
</script>

<template>
  <div class="character-detail">
    <!-- Show loading spinner while data is being fetched -->
    <div v-if="loading" class="spinner-container">
      <div class="spinner"></div>
    </div>

    <!-- Show error message if the API request fails -->
    <p v-if="error" class="character-detail__error">{{ error }}</p>

    <div v-if="character" class="character-detail__card">
      <img
        :src="character.image"
        :alt="character.name"
        :class="`character-detail__card__img--${character.status.toLowerCase()}`"
        class="character-detail__image"
      />
      <div class="character-detail__info">
        <h1 class="character-detail__name">{{ character.name }}</h1>
        <p>
          <strong>Status:</strong>
          <span
            :class="`character-detail__status character-detail__status--${character.status.toLowerCase()}`"
            >{{ character.status }}</span
          >
        </p>
        <p><strong>Species:</strong> {{ character.species }}</p>
        <p><strong>Gender:</strong> {{ character.gender }}</p>
        <p>
          <strong> Created: </strong> {{ new Date(character.created).toLocaleDateString('fr-FR') }}
        </p>
      </div>
      <button @click="$router.push('/characters')" class="btn-back">Back</button>
    </div>
  </div>
</template>

<style scoped lang="scss">
.character-detail {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  text-align: center;
  padding: 20px;

  &__card {
    background: $background-color;
    padding: 30px;
    border-radius: 12px;
    box-shadow: 0 4px 8px rgb(0 0 0 / 33%);
    display: flex;
    flex-direction: column;
    align-items: center;
    max-width: 500px;
    width: 100%;
    animation: fadeIn 0.5s ease-in-out;
    &__img {
      &--alive {
        border: 4px solid $status-alive;
      }
      &--dead {
        border: 4px solid $status-dead;
      }
      &--unknown {
        border: 4px solid $status-unknown;
      }
    }
  }

  &__image {
    height: 150px;
    border-radius: 50%;
  }

  &__info {
    margin-top: 20px;
    text-align: left;

    p {
      text-align: center;
      margin-bottom: 5px;

      strong {
        font-weight: 600;
      }
    }
  }

  &__name {
    font-size: 24px;
    font-weight: 600;
    color: $text-color;
    margin-bottom: 10px;
  }

  /* Style for character status (Alive, Dead, Unknown) */
  &__status {
    font-weight: bold;
    padding: 5px 10px;
    border-radius: 8px;
    margin-left: 5px;
    color: $white;

    &--alive {
      background-color: $status-alive;
    }
    &--dead {
      background-color: $status-dead;
    }
    &--unknown {
      background-color: $status-unknown;
    }
  }

  &__error {
    color: $error-color;
  }
}

@keyframes fadeIn {
  0% {
    opacity: 0;
    transform: translateY(-10px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
