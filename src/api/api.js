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

// API Methods
export const api = {
  async fetchGuests(weddingType) {
    const response = await fetch(`${getApiBase(weddingType)}`);
    if (!response.ok) throw new Error('Failed to fetch guests');
    return await response.json();
  },

  async addGuest(weddingType, guestData) {
    const response = await fetch(`${getApiBase(weddingType)}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(guestData)
    });
    if (!response.ok) throw new Error('Failed to add guest');
    return await response.json();
  },

  async deleteGuest(weddingType, guestId) {
    const response = await fetch(`${getApiBase(weddingType)}/${guestId}`, {
      method: 'DELETE'
    });
    if (!response.ok) throw new Error('Failed to delete guest');
    return true;
  }
};

// Usage example:
// const guests = await api.fetchGuests('huor');
// await api.addGuest('roth', { name: 'John Doe' });
