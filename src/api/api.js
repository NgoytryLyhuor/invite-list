// /src/api/api.js
const API_CONFIG = {
  huor: {
    local: 'http://127.0.0.1:8000/api/huor-guests',
    production: 'https://wedding.apilab.website/api/huor-guests'
  },
  roth: {
    local: 'http://127.0.0.1:8000/api/roth-guests',
    production: 'https://wedding.apilab.website/api/roth-guests'
  }
};

const isLocalDevelopment = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';

function getApiBase(weddingType) {
  return isLocalDevelopment
    ? API_CONFIG[weddingType].local
    : API_CONFIG[weddingType].production;
}

// API Methods with UTF-8 support
export const api = {
  async fetchGuests(weddingType) {
    const response = await fetch(`${getApiBase(weddingType)}`, {
      headers: {
        'Accept': 'application/json; charset=utf-8'
      }
    });
    if (!response.ok) throw new Error('Failed to fetch guests');
    return await response.json();
  },

  async addGuest(weddingType, guestData) {
    const response = await fetch(`${getApiBase(weddingType)}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        'Accept': 'application/json; charset=utf-8'
      },
      body: JSON.stringify(guestData)
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || 'Failed to add guest');
    }

    return await response.json();
  },

  async deleteGuest(weddingType, guestId) {
    const response = await fetch(`${getApiBase(weddingType)}/${guestId}`, {
      method: 'DELETE',
      headers: {
        'Accept': 'application/json; charset=utf-8'
      }
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || 'Failed to delete guest');
    }

    return true;
  }
};

// Enhanced usage example with error handling:
/*
try {
  const guests = await api.fetchGuests('huor');
  await api.addGuest('huor', { name: 'លោក Apple និង friend' });
} catch (error) {
  console.error('API Error:', error.message);
}
*/
