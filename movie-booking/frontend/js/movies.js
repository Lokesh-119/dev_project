/**
 * MovieBook - Movies Catalog Page Script
 * Calls GET /api/movies to fetch all movies and provides search/filtering
 */

const API_BASE_URL = 'http://localhost:5000/api';

let allMovies = [];

// Fallback sample movies in case backend is offline
const fallbackMovies = [
  {
    _id: 'sample-interstellar',
    title: 'Interstellar',
    description: 'A team of explorers travel through a wormhole in space in an attempt to ensure humanity\'s survival.',
    genre: 'Sci-Fi / Adventure',
    language: 'English',
    duration: '169 min',
    rating: 8.7,
    price: 150,
    poster: 'https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?w=800&auto=format&fit=crop&q=80',
    availableSeats: 37,
  },
  {
    _id: 'sample-inception',
    title: 'Inception',
    description: 'A thief who steals corporate secrets through the use of dream-sharing technology is given an inverse task.',
    genre: 'Sci-Fi / Action',
    language: 'English',
    duration: '148 min',
    rating: 8.8,
    price: 150,
    poster: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=800&auto=format&fit=crop&q=80',
    availableSeats: 38,
  },
  {
    _id: 'sample-avengers',
    title: 'Avengers: Endgame',
    description: 'After the devastating events of Infinity War, the remaining Avengers assemble once more to reverse Thanos\' actions.',
    genre: 'Action / Sci-Fi',
    language: 'English',
    duration: '181 min',
    rating: 8.4,
    price: 180,
    poster: 'https://images.unsplash.com/photo-1568832359672-e36cf5d74f54?w=800&auto=format&fit=crop&q=80',
    availableSeats: 36,
  },
  {
    _id: 'sample-spiderman',
    title: 'Spider-Man: No Way Home',
    description: 'Peter Parker seeks Doctor Strange\'s help to regain his secret identity, releasing dangerous villains.',
    genre: 'Action / Adventure',
    language: 'English',
    duration: '148 min',
    rating: 8.2,
    price: 150,
    poster: 'https://images.unsplash.com/photo-1635805737707-575885ab0820?w=800&auto=format&fit=crop&q=80',
    availableSeats: 39,
  },
  {
    _id: 'sample-darkknight',
    title: 'The Dark Knight',
    description: 'Batman must accept one of the greatest psychological and physical tests to fight the chaotic Joker.',
    genre: 'Action / Crime',
    language: 'English',
    duration: '152 min',
    rating: 9.0,
    price: 150,
    poster: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=800&auto=format&fit=crop&q=80',
    availableSeats: 37,
  },
  {
    _id: 'sample-rrr',
    title: 'RRR',
    description: 'A fearless warrior on a perilous mission comes face to face with a steely cop in British pre-independent India.',
    genre: 'Action / Drama',
    language: 'Telugu / Hindi',
    duration: '182 min',
    rating: 8.0,
    price: 160,
    poster: 'https://images.unsplash.com/photo-1518676590629-3dcbd9c5a5c9?w=800&auto=format&fit=crop&q=80',
    availableSeats: 40,
  },
];

document.addEventListener('DOMContentLoaded', () => {
  setupMobileNav();
  setupFilterListeners();
  checkUrlParams();
  loadAllMovies();
});

/**
 * Mobile Navigation Toggle
 */
function setupMobileNav() {
  const toggleBtn = document.getElementById('mobileNavToggle');
  const navLinks = document.getElementById('navLinks');

  if (toggleBtn && navLinks) {
    toggleBtn.addEventListener('click', () => {
      navLinks.classList.toggle('open');
    });
  }
}

/**
 * Check if search query was passed via URL (?search=...)
 */
function checkUrlParams() {
  const params = new URLSearchParams(window.location.search);
  const searchParam = params.get('search');
  if (searchParam) {
    const searchInput = document.getElementById('movieSearchInput');
    if (searchInput) {
      searchInput.value = searchParam;
    }
  }
}

/**
 * Setup event listeners for search and filters
 */
function setupFilterListeners() {
  const searchInput = document.getElementById('movieSearchInput');
  const genreFilter = document.getElementById('genreFilter');
  const languageFilter = document.getElementById('languageFilter');
  const sortFilter = document.getElementById('sortFilter');
  const clearBtn = document.getElementById('clearFiltersBtn');

  if (searchInput) {
    searchInput.addEventListener('input', applyFilters);
  }
  if (genreFilter) {
    genreFilter.addEventListener('change', applyFilters);
  }
  if (languageFilter) {
    languageFilter.addEventListener('change', applyFilters);
  }
  if (sortFilter) {
    sortFilter.addEventListener('change', applyFilters);
  }
  if (clearBtn) {
    clearBtn.addEventListener('click', () => {
      if (searchInput) searchInput.value = '';
      if (genreFilter) genreFilter.value = 'all';
      if (languageFilter) languageFilter.value = 'all';
      if (sortFilter) sortFilter.value = 'featured';
      applyFilters();
    });
  }
}

/**
 * Fetch movies from Backend API
 */
async function loadAllMovies() {
  const grid = document.getElementById('moviesListGrid');
  if (!grid) return;

  grid.innerHTML = '<div class="spinner" style="grid-column: 1 / -1;"></div>';

  try {
    const response = await fetch(`${API_BASE_URL}/movies`);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    allMovies = result.data || [];

    if (allMovies.length === 0) {
      allMovies = fallbackMovies;
    }

    populateDynamicFilters();
    applyFilters();
  } catch (error) {
    console.warn('Backend API connection failed, using sample movies:', error.message);
    allMovies = fallbackMovies;
    populateDynamicFilters();
    applyFilters();
  }
}

/**
 * Dynamically populate genres and languages into select dropdowns
 */
function populateDynamicFilters() {
  const genreFilter = document.getElementById('genreFilter');
  const languageFilter = document.getElementById('languageFilter');

  if (genreFilter) {
    const genres = new Set();
    allMovies.forEach((m) => {
      if (m.genre) {
        m.genre.split(/[\/,]/).forEach((g) => genres.add(g.trim()));
      }
    });

    const currentGenre = genreFilter.value;
    genreFilter.innerHTML = '<option value="all">All Genres</option>';
    genres.forEach((g) => {
      if (g) {
        const opt = document.createElement('option');
        opt.value = g.toLowerCase();
        opt.textContent = g;
        genreFilter.appendChild(opt);
      }
    });
    genreFilter.value = currentGenre;
  }
}

/**
 * Filter and sort movies locally using JavaScript
 */
function applyFilters() {
  const searchTerm = (document.getElementById('movieSearchInput')?.value || '').toLowerCase().trim();
  const selectedGenre = (document.getElementById('genreFilter')?.value || 'all').toLowerCase();
  const selectedLanguage = (document.getElementById('languageFilter')?.value || 'all').toLowerCase();
  const selectedSort = document.getElementById('sortFilter')?.value || 'featured';

  let filtered = allMovies.filter((movie) => {
    const matchSearch =
      movie.title.toLowerCase().includes(searchTerm) ||
      (movie.description && movie.description.toLowerCase().includes(searchTerm)) ||
      (movie.genre && movie.genre.toLowerCase().includes(searchTerm));

    const matchGenre =
      selectedGenre === 'all' ||
      (movie.genre && movie.genre.toLowerCase().includes(selectedGenre));

    const matchLanguage =
      selectedLanguage === 'all' ||
      (movie.language && movie.language.toLowerCase().includes(selectedLanguage));

    return matchSearch && matchGenre && matchLanguage;
  });

  // Sorting
  if (selectedSort === 'rating-desc') {
    filtered.sort((a, b) => (b.rating || 0) - (a.rating || 0));
  } else if (selectedSort === 'title-asc') {
    filtered.sort((a, b) => a.title.localeCompare(b.title));
  } else if (selectedSort === 'price-asc') {
    filtered.sort((a, b) => (a.price || 0) - (b.price || 0));
  }

  renderFilteredMovies(filtered);
}

/**
 * Render filtered movie cards
 */
function renderFilteredMovies(movies) {
  const grid = document.getElementById('moviesListGrid');
  const countBadge = document.getElementById('moviesCountBadge');

  if (countBadge) {
    countBadge.textContent = `${movies.length} Movie${movies.length === 1 ? '' : 's'}`;
  }

  if (!grid) return;

  if (movies.length === 0) {
    grid.innerHTML = `
      <div class="empty-state" style="grid-column: 1 / -1;">
        <div class="empty-icon">🔍</div>
        <h3 class="empty-title">No Movies Match Your Search</h3>
        <p class="empty-text">Try adjusting your keywords, genres, or language filters.</p>
        <button class="btn btn-secondary" onclick="document.getElementById('clearFiltersBtn').click()">Reset Filters</button>
      </div>
    `;
    return;
  }

  grid.innerHTML = movies
    .map(
      (movie) => `
    <div class="movie-card">
      <div class="movie-poster-wrap">
        <img 
          src="${movie.poster || 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=800&auto=format&fit=crop&q=80'}" 
          alt="${movie.title}" 
          class="movie-poster"
          loading="lazy"
          onerror="this.src='https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=800&auto=format&fit=crop&q=80'"
        />
        <div class="movie-poster-overlay"></div>
        <div class="poster-rating">⭐ ${movie.rating || '8.0'}</div>
        <div class="poster-price">₹${movie.price || 150}</div>
      </div>
      <div class="movie-info">
        <h3 class="movie-title" title="${movie.title}">${movie.title}</h3>
        <div class="movie-meta-tags">
          <span class="badge badge-genre">${movie.genre}</span>
          <span class="badge badge-lang">${movie.language}</span>
        </div>
        ${
          movie.description
            ? `<p style="font-size: 0.84rem; color: var(--text-secondary); margin-bottom: 12px; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;">${movie.description}</p>`
            : ''
        }
        <div class="movie-details-strip">
          <span>⏱️ ${movie.duration}</span>
          <span class="seats-badge">🎟️ ${movie.availableSeats !== undefined ? movie.availableSeats : 40} seats left</span>
        </div>
        <div class="movie-action">
          <button type="button" class="btn btn-primary btn-block" onclick="bookMovie('${movie._id}')">
            Book Now
          </button>
        </div>
      </div>
    </div>
  `
    )
    .join('');
}

/**
 * Navigate to booking page with movie ID stored in session
 */
window.bookMovie = function(movieId) {
  try {
    sessionStorage.setItem('selectedMovieId', movieId);
  } catch (e) {
    console.warn('sessionStorage error:', e);
  }
  window.location.href = `booking.html?id=${movieId}`;
};
