document.addEventListener('DOMContentLoaded', initCatalogPage);

let catalogData = [];

async function initCatalogPage() {
    const catalogContainer = document.querySelector('[data-catalog]');
    if (!catalogContainer) return;

    try {
        document.getElementById('loadingState').hidden = false;
        
        const response = await fetch('../data/items.json');
        if (!response.ok) throw new Error('Не вдалося завантажити дані');
        
        catalogData = await response.json();
        
        document.getElementById('loadingState').hidden = true;
        renderCards(catalogData);
        initControls();
        
    } catch (error) {
        document.getElementById('loadingState').hidden = true;
        document.getElementById('errorState').hidden = false;
        document.getElementById('errorState').textContent = error.message; 
    }
}

function renderCards(items) {
    const container = document.querySelector('[data-catalog]');
    container.innerHTML = '';

    if (items.length === 0) {
        document.getElementById('emptyState').hidden = false;
        return;
    }
    document.getElementById('emptyState').hidden = true;

    const itemsToShow = items.slice(0, 6); 

    itemsToShow.forEach(item => {
        const card = document.createElement('div');
        card.className = 'card';
        card.innerHTML = `
            <img src="${item.image}" alt="${item.title}">
            <h3>${item.title}</h3>
            <p>${item.description}</p> <button class="fav-btn" data-id="${item.id}">В обране</button> `;
        container.appendChild(card);
    });
    
    initFavorites();
}

function initControls() {
    document.getElementById('searchInput').addEventListener('input', applyFiltersAndSort); //
    document.getElementById('categoryFilter').addEventListener('change', applyFiltersAndSort);
    document.getElementById('sortSelect').addEventListener('change', applyFiltersAndSort);
}

function applyFiltersAndSort() {
    const query = document.getElementById('searchInput').value.toLowerCase();
    const category = document.getElementById('categoryFilter').value;
    const sortBy = document.getElementById('sortSelect').value;

    let filteredItems = catalogData.filter(item => {
        const matchesQuery = item.title.toLowerCase().includes(query) || item.description.toLowerCase().includes(query);
        const matchesCategory = category === 'all' || item.category === category;
        return matchesQuery && matchesCategory;
    });

    if (sortBy === 'price-asc') {
        filteredItems.sort((a, b) => a.price - b.price);
    }

    renderCards(filteredItems);
}

const favoritesKey = 'catalogFavorites';

function initFavorites() {
    const buttons = document.querySelectorAll('.fav-btn');
    const favorites = JSON.parse(localStorage.getItem(favoritesKey) || '[]');

    buttons.forEach(btn => {
        const id = btn.getAttribute('data-id');
        if (favorites.includes(id)) {
            btn.textContent = 'Видалити з обраного';
        }

        btn.addEventListener('click', () => {
            toggleFavorite(id, btn);
        });
    });
}

function toggleFavorite(id, button) {
    let favorites = JSON.parse(localStorage.getItem(favoritesKey) || '[]');
    
    if (favorites.includes(id)) {
        favorites = favorites.filter(favId => favId !== id);
        button.textContent = 'В обране';
    } else {
        favorites.push(id);
        button.textContent = 'Видалити з обраного';
    }
    
    localStorage.setItem(favoritesKey, JSON.stringify(favorites));
}