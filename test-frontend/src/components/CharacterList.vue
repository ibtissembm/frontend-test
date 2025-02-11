<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import axios from 'axios'
import type { Character } from '@/interfaces/Character'
import CharacterCard from '@/components/CharacterCard.vue'

const characters = ref<Character[]>([])
const page = ref<number>(1)
const totalPages = ref(1)
const search = ref('')
const status = ref('')
const gender = ref('')
const species = ref('')
const loading = ref(false)
const error = ref('')
const pageSize = 12
const prevPageUrl = ref<string | null>(null)
const nextPageUrl = ref<string | null>(null)

// Function to fetch characters from the API
const fetchCharacters = async () => {
  loading.value = true
  error.value = ''

  // Check if the search contains at least 3 letters before making the request
  if (search.value.length > 0 && search.value.length < 3) {
    loading.value = false
    return
  }

  try {
    const response = await axios.get('https://rickandmortyapi.com/api/character', {
      params: {
        page: page.value,
        name: search.value || undefined,
        status: status.value.length > 0 ? status.value.split(',') : undefined,
        gender: gender.value.length > 0 ? gender.value.split(',') : undefined,
        species: species.value.length > 0 ? species.value.split(',') : undefined,
      },
    })

    // Store previous and next page URLs
    prevPageUrl.value = page.value > 1 ? response.data.info.prev : null
    nextPageUrl.value = page.value < totalPages.value ? response.data.info.next : null

    characters.value = response.data.results.slice(0, pageSize)
    totalPages.value = response.data.info.pages
  } catch (err: any) {
    if (err.response) {
      if (err.response.status === 404) {
        error.value = 'Aucun personnage ne correspond à votre recherche.'
      } else if (err.response.status >= 500) {
        error.value = 'Erreur du serveur. Veuillez réessayer plus tard.'
      }
    } else if (err.message.includes('timeout')) {
      error.value = 'La connexion a expiré. Veuillez vérifier votre connexion internet.'
    } else {
      error.value = "Une erreur inattendue s'est produite."
    }
  } finally {
    loading.value = false
  }
}

// Function to navigate to the previous page if available
const goToPrevPage = () => {
  if (page.value > 1) {
    page.value--
    fetchCharacters()
  }
}

// Function to navigate to the next page if available
const goToNextPage = () => {
  if (nextPageUrl.value) {
    page.value++
    fetchCharacters()
  }
}

const goToPage = (num: number) => {
  if (num !== page.value) {
    page.value = num
    fetchCharacters()
  }
}

const resetFilters = () => {
  search.value = ''
  status.value = ''
  gender.value = ''
  species.value = ''
  fetchCharacters()
}

// Generate dynamic pagination with dots
const displayedPages = computed(() => {
  const pages: (number | string)[] = []
  if (totalPages.value <= 5) {
    for (let i = 1; i <= totalPages.value; i++) {
      pages.push(i)
    }
  } else {
    if (page.value <= 3) {
      pages.push(1, 2, 3, '...', totalPages.value)
    } else if (page.value >= totalPages.value - 2) {
      pages.push(1, '...', totalPages.value - 2, totalPages.value - 1, totalPages.value)
    } else {
      pages.push(1, '...', page.value - 1, page.value, page.value + 1, '...', totalPages.value)
    }
  }
  return pages
})

// Computed property to check if at least one filter is active
const isFilterActive = computed(
  () => !!(search.value || status.value || gender.value || species.value),
)

// Fetch data when the component is mounted
onMounted(fetchCharacters)
</script>

<template>
  <div class="character-list">
    <!-- Search bar and filter selection -->
    <div class="character-list__filters">
      <input
        v-model="search"
        class="character-list__filters--input"
        placeholder="Search for a character..."
      />

      <select v-model="status" class="character-list__filters--select">
        <option value="">All statuses</option>
        <option value="alive">Alive</option>
        <option value="dead">Dead</option>
        <option value="unknown">Unknown</option>
      </select>

      <select v-model="gender" class="character-list__filters--select">
        <option value="">All genres</option>
        <option value="male">Male</option>
        <option value="female">Female</option>
        <option value="genderless">Genderless</option>
        <option value="unknown">Unknown</option>
      </select>

      <select v-model="species" class="character-list__filters--select">
        <option value="">All species</option>
        <option value="human">Human</option>
        <option value="alien">Alien</option>
        <option value="robot">Robot</option>
        <option value="mythological creature">Mythological Creature</option>
        <option value="unknown">Unknown</option>
      </select>

      <!-- button "Search" -->
      <button
        @click="fetchCharacters"
        :disabled="!isFilterActive"
        class="character-list__filters--search-button"
      >
        Search
      </button>

      <!-- button "Reset" -->
      <button
        @click="resetFilters"
        :class="{ 'reset-opacity': !isFilterActive }"
        class="character-list__filters--reset-button"
      >
        Reset
      </button>
    </div>

    <!-- Show loading spinner while fetching data -->
    <div v-if="loading" class="spinner-container">
      <div class="spinner"></div>
    </div>

    <!-- Display error message if API call fails -->
    <p v-if="error" class="error">{{ error }}</p>

    <!-- Display character grid if data is loaded -->
    <div v-if="!loading && !error" class="grid">
      <CharacterCard v-for="character in characters" :key="character.id" :character="character" />
    </div>

    <!-- Pagination buttons -->
    <div v-if="totalPages > 1 && !error && !loading" class="pagination">
      <button @click="goToPrevPage" :disabled="page <= 1" class="pagination__button">
        Previous
      </button>
      <button
        v-for="num in displayedPages"
        :key="num"
        @click="typeof num === 'number' ? goToPage(num) : null"
        :class="{ 'pagination__button--active': page === num }"
        class="pagination__button"
      >
        {{ num }}
      </button>
      <button @click="goToNextPage" :disabled="page === totalPages" class="pagination__button">
        Next
      </button>
    </div>
  </div>
</template>

<style scoped lang="scss">
.character-list {
  text-align: center;

  &__filters {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 15px;
    margin-bottom: 20px;
    margin-top: 20px;

    &--input {
      padding: 10px;
      border: 1px solid $border-color;
      border-radius: 5px;
      font-size: 16px;
      width: 250px;
    }

    &--select {
      padding: 10px;
      border: 2px solid $primary-color;
      border-radius: 5px;
      background-color: $primary-color;
      color: $white;
      font-size: 16px;
      padding-left: 20px;

      cursor: pointer;
      transition:
        background-color 0.3s,
        transform 0.2s;
      option {
        color: $text-color;
        background-color: $white;
      }
    }

    &--reset-button {
      padding: 10px 20px;
      border: 2px solid $error-color;
      background-color: transparent;
      color: $error-color;
      font-size: 16px;
      text-transform: uppercase;
      font-weight: bold;
      border-radius: 5px;
      cursor: pointer;
      transition:
        background-color 0.3s,
        transform 0.2s;

      &:hover {
        background-color: transparent;
        color: $error-color;
      }
      &:disabled {
        background-color: transparent;
        color: $error-color;
        opacity: 0.4;
        cursor: auto;
      }
    }
    &--search-button {
      padding: 10px 20px;
      border: 2px solid $green-color;
      background-color: $green-color;
      color: $white;
      font-size: 16px;
      text-transform: uppercase;
      font-weight: bold;
      border-radius: 5px;
      cursor: pointer;
      transition:
        background-color 0.3s,
        transform 0.2s;
      &:hover {
        background-color: transparent;
        color: $green-color;
      }
      &:disabled {
        background-color: $green-color;
        color: $white;
        opacity: 0.4;
        cursor: auto;
      }
    }
  }
}

.grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 20px;
  justify-items: center;
  padding: 20px;

  .character-card {
    opacity: 0;
    transform: translateY(10px);
    animation: fadeIn 0.5s ease-in-out forwards;
  }
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@media (max-width: 1024px) {
  .grid {
    grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  }
}

@media (max-width: 768px) {
  .grid {
    grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  }

  .character-list__filters {
    flex-direction: column;
    align-items: center;
  }
}

@media (max-width: 480px) {
  .grid {
    grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
  }
}

.pagination {
  display: flex;
  justify-content: center;
  gap: 8px;
  margin-top: 20px;

  &__button {
    padding: 7px 14px;
    border: none;
    border-radius: 8px;
    background-color: $primary-color;
    color: white;
    font-size: 16px;
    cursor: pointer;
    transition:
      background 0.3s,
      transform 0.2s ease-in-out;

    &:hover,
    &--active {
      background-color: $primary-hover;
      font-weight: bold;
      transform: scale(1.1);
      box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
    }

    &:disabled {
      opacity: 0.4;
      cursor: not-allowed;
    }
  }
}
@media (max-width: 991px) {
  .pagination__button {
    font-size: 12px;
  }
}
.reset-opacity {
  pointer-events: none;
  opacity: 0;
}
</style>
