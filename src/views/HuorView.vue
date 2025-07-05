<template>
  <div :class="[
    'min-h-screen transition-colors duration-300',
    isDarkMode ? 'bg-gray-950 text-gray-100' : 'bg-gradient-to-br from-blue-50 to-indigo-50 text-gray-900'
  ]">
    <!-- Floating bubbles background -->
    <div class="fixed inset-0 overflow-hidden -z-10 pointer-events-none">
      <div v-for="i in 15" :key="i" :class="[
        'absolute rounded-full opacity-5 animate-float',
        isDarkMode ? 'bg-blue-500' : 'bg-indigo-300'
      ]" :style="{
        width: `${Math.random() * 20 + 10}px`,
        height: `${Math.random() * 20 + 10}px`,
        left: `${Math.random() * 100}%`,
        top: `${Math.random() * 100}%`,
        animationDuration: `${Math.random() * 30 + 30}s`,
        animationDelay: `${Math.random() * 5}s`
      }"></div>
    </div>

    <!-- Floating action buttons -->
    <button @click="showAddModal = true" :class="[
      'fixed bottom-[200px] right-6 z-20 w-14 h-14 rounded-full flex items-center justify-center shadow-lg transition-all duration-300 hover:scale-110',
      isDarkMode ? 'bg-blue-600 text-white' : 'bg-white text-blue-600 border-2 border-blue-200'
    ]" aria-label="Add new guest">
      <span class="text-2xl">+</span>
    </button>

    <!-- Scroll to Top button -->
    <button @click="scrollToTop" :class="[
      'fixed bottom-24 right-6 z-20 w-14 h-14 rounded-full flex items-center justify-center shadow-lg transition-all duration-300 hover:scale-110',
      isDarkMode ? 'bg-indigo-600 text-white' : 'bg-white text-indigo-600 border-2 border-indigo-200'
    ]" aria-label="Scroll to top" v-show="showScrollToTop">
      <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 15l7-7 7 7" />
      </svg>
    </button>

    <!-- Main content -->
    <div class="max-w-md mx-auto px-4 py-6 pb-24 overflow-y-auto max-h-screen" ref="scrollContainer"
      @scroll="handleScroll">
      <!-- App header -->
      <header class="mb-8 relative">
        <div class="absolute -top-6 -left-4 w-24 h-24 rounded-full blur-xl opacity-20 bg-blue-400"></div>
        <div class="relative z-10 flex items-center justify-between">
          <div class="flex items-center gap-3">
            <div :class="[
              'w-12 h-12 rounded-xl flex items-center justify-center text-2xl',
              isDarkMode ? 'bg-gray-800' : 'bg-white shadow-sm'
            ]">
              🚗
            </div>
            <div>
              <h1 class="text-2xl font-bold"><b>Huor</b> - Guest List</h1>
              <p class="text-sm opacity-70">25-01-2026</p>
            </div>
          </div>
          <button @click="toggleDarkMode" :class="[
            'p-2 rounded-xl transition-all',
            isDarkMode ? 'bg-gray-800 text-amber-300' : 'bg-white text-gray-700'
          ]" aria-label="Toggle theme">
            <span class="text-xl">{{ isDarkMode ? '🌙' : '☀️' }}</span>
          </button>
        </div>
      </header>

      <!-- Guest counter -->
      <div :class="[
        'rounded-lg p-3 mb-3 relative overflow-hidden flex items-center justify-between',
        isDarkMode ? 'bg-gray-800' : 'bg-white shadow-sm'
      ]">
        <div class="relative flex items-center justify-between">
          <span class="text-3xl font-bold text-blue-500">
            {{ filteredGuests.length }}<span v-if="searchQuery" class="text-sm opacity-70">/{{ guests.length }}</span>
          </span>
          <span class="pl-2">Guest{{ filteredGuests.length !== 1 ? 's' : '' }}</span>
        </div>
        <router-link to="/" class="text-4xl">
          🤵‍♂️
        </router-link>
      </div>

      <div :class="[
        'rounded-lg p-3 mb-3 relative overflow-hidden',
        isDarkMode ? 'bg-gray-800' : 'bg-white shadow-sm'
      ]">
        <div class="flex items-center gap-2">
          <svg class="w-5 h-5 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input v-model="searchQuery" type="text" placeholder="Search guests..." :class="[
            'w-full bg-transparent focus:outline-none',
            isDarkMode ? 'placeholder-gray-500' : 'placeholder-gray-400'
          ]">
        </div>
      </div>

      <!-- Loading state -->
      <div v-if="loading" class="text-center py-8">
        <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
        <p class="mt-2">Loading guests...</p>
      </div>

      <!-- Error state -->
      <div v-else-if="error" :class="[
        'rounded-lg p-6 text-center',
        isDarkMode ? 'bg-red-900/20 text-red-300' : 'bg-red-100 text-red-600'
      ]">
        <div class="text-4xl mb-3">⚠️</div>
        <h3 class="text-lg font-medium mb-1">Error loading guests</h3>
        <p class="mb-4">{{ error }}</p>
        <button @click="fetchGuests" :class="[
          'px-4 py-2 rounded-lg font-medium',
          isDarkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-white hover:bg-gray-50'
        ]">
          Try Again
        </button>
      </div>

      <!-- Guest list -->
      <div v-else class="space-y-1">
        <div v-for="(guest, index) in filteredGuests" :key="guest.id" :class="[
          'rounded-lg transition-all active:scale-[0.98]',
          isDarkMode ? 'bg-gray-800 hover:bg-gray-700' : 'bg-white hover:bg-gray-50 shadow-sm'
        ]">
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-3">
              <div :class="[
                'w-10 h-10 rounded-lg flex items-center justify-center text-lg font-bold',
                isDarkMode ? 'bg-gray-700' : 'bg-gray-100'
              ]">
                {{ index + 1 }}
              </div>
              <h3 class="font-medium">{{ guest.name }}</h3>
            </div>
            <button @click.stop="prepareDelete(guest)" :class="[
              'p-2 rounded-lg transition-colors',
              isDarkMode ? 'text-red-400' : 'text-red-500'
            ]" aria-label="Delete guest">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </div>
        </div>

        <!-- Empty state -->
        <div v-if="guests.length === 0" :class="[
          'rounded-lg p-8 text-center',
          isDarkMode ? 'bg-gray-800' : 'bg-white shadow-sm'
        ]">
          <div class="text-5xl mb-4">📋</div>
          <h3 class="text-lg font-medium mb-1">No guests yet</h3>
          <p class="text-sm opacity-70 mb-4">Your guest list is waiting to be filled</p>
          <button @click="showAddModal = true" :class="[
            'px-6 py-2 rounded-lg font-medium transition-all',
            isDarkMode ? 'bg-blue-600 text-white' : 'bg-blue-100 text-blue-600'
          ]">
            Add First Guest
          </button>
        </div>
      </div>
    </div>

    <!-- Add Guest Modal -->
    <div v-if="showAddModal"
      class="fixed inset-0 z-30 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
      @click.self="showAddModal = false">
      <div :class="[
        'w-full max-w-md rounded-lg p-6',
        isDarkMode ? 'bg-gray-900' : 'bg-white'
      ]">
        <div class="flex justify-between items-center mb-4">
          <h2 class="text-xl font-bold">Add Guest</h2>
          <button @click="showAddModal = false" class="p-1 rounded-full opacity-70 hover:opacity-100">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium mb-1 opacity-80">Guest Name</label>
            <input ref="nameInput" v-model="newGuestName" type="text" placeholder="Enter full name" :class="[
              'w-full px-4 py-3 rounded-xl border focus:outline-none focus:ring-2',
              isDarkMode
                ? 'bg-gray-800 border-gray-700 focus:ring-blue-500'
                : 'bg-white border-gray-200 focus:ring-blue-400'
            ]" @keypress.enter="addGuest" :disabled="addingGuest">
          </div>

          <div v-if="addError" :class="[
            'p-3 rounded-lg text-sm',
            isDarkMode ? 'bg-red-900/20 text-red-300' : 'bg-red-100 text-red-600'
          ]">
            {{ addError }}
          </div>

          <div class="flex items-center gap-3 pt-2">
            <button @click="showAddModal = false" :disabled="addingGuest" :class="[
              'flex-1 py-3 rounded-xl font-medium transition-all',
              isDarkMode ? 'bg-gray-800 hover:bg-gray-700' : 'bg-gray-100 hover:bg-gray-200',
              addingGuest ? 'opacity-70 cursor-not-allowed' : ''
            ]">
              Cancel
            </button>
            <button @click="addGuest" :disabled="!newGuestName.trim() || addingGuest" :class="[
              'flex-1 py-3 rounded-xl font-medium transition-all',
              newGuestName.trim()
                ? (addingGuest
                  ? (isDarkMode ? 'bg-blue-800 text-gray-400' : 'bg-blue-300 text-white')
                  : 'bg-blue-600 text-white hover:bg-blue-700')
                : (isDarkMode ? 'bg-gray-800 text-gray-500' : 'bg-gray-100 text-gray-400')
            ]">
              <span v-if="!addingGuest">Add Guest</span>
              <span v-else class="inline-flex items-center">
                <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none"
                  viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z">
                  </path>
                </svg>
                Adding...
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Delete Confirmation Modal -->
    <div v-if="guestToDelete"
      class="fixed inset-0 z-30 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div :class="[
        'w-full max-w-md rounded-lg p-6',
        isDarkMode ? 'bg-gray-900' : 'bg-white'
      ]">
        <div class="text-center mb-3">
          <div class="text-5xl mb-3">❓</div>
          <h2 class="text-xl font-bold mb-1">Delete Guest?</h2>
          <p class="opacity-70">Are you sure you want to remove <span class="font-medium">{{ guestToDelete.name
              }}</span> from your guest list?</p>
        </div>

        <div v-if="deleteError" :class="[
          'p-3 rounded-lg text-sm mb-4',
          isDarkMode ? 'bg-red-900/20 text-red-300' : 'bg-red-100 text-red-600'
        ]">
          {{ deleteError }}
        </div>

        <div class="flex items-center gap-3">
          <button @click="guestToDelete = null" :disabled="deletingGuest" :class="[
            'flex-1 py-3 rounded-xl font-medium transition-all',
            isDarkMode ? 'bg-gray-800 hover:bg-gray-700' : 'bg-gray-100 hover:bg-gray-200',
            deletingGuest ? 'opacity-70 cursor-not-allowed' : ''
          ]">
            Cancel
          </button>
          <button @click="confirmDelete" :disabled="deletingGuest" :class="[
            'flex-1 py-3 rounded-xl font-medium transition-all flex items-center justify-center gap-2',
            isDarkMode ? 'bg-red-900/30 text-red-400 hover:bg-red-900/40' : 'bg-red-100 text-red-600 hover:bg-red-200',
            deletingGuest ? 'opacity-70 cursor-not-allowed' : ''
          ]">
            <svg v-if="!deletingGuest" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
            <svg v-else class="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z">
              </path>
            </svg>
            {{ deletingGuest ? 'Deleting...' : 'Delete' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, nextTick, computed, watch } from 'vue'
import { api } from '@/api/api';

// Refs
const nameInput = ref(null);
const emptyStateButton = ref(null);
const guests = ref([])
const newGuestName = ref('')
const isDarkMode = ref(false)
const showAddModal = ref(false)
const guestToDelete = ref(null)
const showScrollToTop = ref(false)
const scrollContainer = ref(null)
const searchQuery = ref('')

// Loading states
const loading = ref(true)
const error = ref(null)
const addingGuest = ref(false)
const addError = ref(null)
const deletingGuest = ref(false)
const deleteError = ref(null)

// Watch for modal open to focus input
watch(showAddModal, (newVal) => {
  if (newVal) {
    nextTick(() => {
      nameInput.value?.focus();
      newGuestName.value = ''; // Clear previous input
    });
  }
});

// Computed
const filteredGuests = computed(() => {
  if (!searchQuery.value) return guests.value;
  const query = searchQuery.value.toLowerCase();
  return guests.value.filter(guest =>
    guest.name.toLowerCase().includes(query)
  );
});


// Methods
const scrollToBottom = () => {
  nextTick(() => {
    if (scrollContainer.value) {
      scrollContainer.value.scrollTo({
        top: scrollContainer.value.scrollHeight,
        behavior: 'smooth'
      })
    }
  })
}

const scrollToTop = () => {
  if (scrollContainer.value) {
    scrollContainer.value.scrollTo({
      top: 0,
      behavior: 'smooth'
    })
  }
}

const handleScroll = () => {
  if (scrollContainer.value) {
    showScrollToTop.value = scrollContainer.value.scrollTop > 100
  }
}

// Fetch guests from API
const fetchGuests = async () => {
  try {
    loading.value = true
    error.value = null
    const data = await api.fetchGuests('huor')
    guests.value = data.data || data
  } catch (err) {
    error.value = err.message || 'Failed to load guests'
  } finally {
    loading.value = false
  }
}

// Add new guest
const addGuest = async () => {
  if (!newGuestName.value.trim()) return

  try {
    addingGuest.value = true
    addError.value = null
    const response = await api.addGuest('huor', {
      name: newGuestName.value.trim()
    })
    guests.value.push(response.data || response)
    newGuestName.value = ''
    showAddModal.value = false
    scrollToBottom()
  } catch (err) {
    addError.value = err.message || 'Failed to add guest'
  } finally {
    addingGuest.value = false
  }
}

// Delete guest
const confirmDelete = async () => {
  if (!guestToDelete.value) return

  try {
    deletingGuest.value = true
    deleteError.value = null
    await api.deleteGuest('huor', guestToDelete.value.id)
    guests.value = guests.value.filter(g => g.id !== guestToDelete.value.id)
    guestToDelete.value = null
  } catch (err) {
    deleteError.value = err.message || 'Failed to delete guest'
  } finally {
    deletingGuest.value = false
  }
}

const prepareDelete = (guest) => {
  guestToDelete.value = guest
}

const toggleDarkMode = () => {
  isDarkMode.value = !isDarkMode.value
  localStorage.setItem('darkMode', isDarkMode.value)
}

// Load preferences and initial data
onMounted(() => {
  const savedMode = localStorage.getItem('darkMode')
  if (savedMode !== null) isDarkMode.value = savedMode === 'true'
  fetchGuests()
})
</script>

<style>
/* Smooth transitions */
* {
  transition: background-color 0.2s ease, border-color 0.2s ease, transform 0.1s ease;
}

/* Button interactions */
button:active {
  transform: scale(0.98);
}

/* Input focus effect */
input:focus {
  transform: scale(1.01);
}

/* Floating bubbles animation */
@keyframes float {

  0%,
  100% {
    transform: translateY(0) rotate(0deg);
  }

  50% {
    transform: translateY(-100vh) rotate(360deg);
  }
}

.animate-float {
  animation: float linear infinite;
}

/* Modal animations */
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-content-enter-active,
.modal-content-leave-active {
  transition: all 0.3s ease;
}

.modal-content-enter-from,
.modal-content-leave-to {
  transform: translateY(20px);
  opacity: 0;
}

/* Custom scrollbar */
/* Custom scrollbar */
.max-h-screen::-webkit-scrollbar-thumb {
  background: rgba(59, 130, 246, 0.5);
  border-radius: 3px;
}

.max-h-screen::-webkit-scrollbar-thumb:hover {
  background: rgba(59, 130, 246, 0.7);
}

.max-h-screen::-webkit-scrollbar-thumb {
  background: rgba(236, 72, 153, 0.5);
  border-radius: 3px;
}

.max-h-screen::-webkit-scrollbar-thumb:hover {
  background: rgba(236, 72, 153, 0.7);
}
</style>
