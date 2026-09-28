/**
 * MovieBook - Main Landing Page Script
 * Communicates with Backend REST API: GET http://localhost:5000/api/movies
 */

const API_BASE_URL = 'http://localhost:5000/api';

// Fallback sample movies in case backend is not yet started or MongoDB is offline
const fallbackMovies = [
  {
    _id: 'sample-interstellar',
    title: 'Interstellar',
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
    genre: 'Action / Crime',
    language: 'English',
    duration: '152 min',
    rating: 9.0,
    price: 150,
    poster: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=800&auto=format&fit=crop&q=80',
    availableSeats: 37,
  },
];

document.addEventListener('DOMContentLoaded', () => {
  setupMobileNav();
  setupHeroSearch();
  fetchFeaturedMovies();
});

/**
 * Setup mobile hamburger menu toggle
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
 * Setup hero search bar to redirect to movies.html with query
 */
function setupHeroSearch() {
  const searchForm = document.getElementById('heroSearchForm');
  const searchInput = document.getElementById('heroSearchInput');

  if (searchForm && searchInput) {
    searchForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const query = searchInput.value.trim();
      if (query) {
        window.location.href = `movies.html?search=${encodeURIComponent(query)}`;
      } else {
        window.location.href = 'movies.html';
      }
    });
  }
}

/**
 * Fetch featured movies using Fetch API
 */
async function fetchFeaturedMovies() {
  const container = document.getElementById('featuredMoviesGrid');
  if (!container) return;

  try {
    container.innerHTML = '<div class="spinner" style="grid-column: 1 / -1;"></div>';

    const response = await fetch(`${API_BASE_URL}/movies`);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    const movies = result.data || [];

    if (movies.length === 0) {
      renderMovies(fallbackMovies, container, true);
    } else {
      // Display top 4-6 featured movies
      renderMovies(movies.slice(0, 6), container, false);
    }
  } catch (error) {
    console.warn('Backend API not responding, showing preview sample data:', error.message);
    renderMovies(fallbackMovies, container, true);
  }
}

/**
 * Render movies into grid
 */
function renderMovies(movies, container, isFallback = false) {
  if (!container) return;

  if (movies.length === 0) {
    container.innerHTML = `
      <div class="empty-state" style="grid-column: 1 / -1;">
        <div class="empty-icon">🎬</div>
        <h3 class="empty-title">No Movies Available</h3>
        <p class="empty-text">Please check back later or verify your MongoDB database connection.</p>
      </div>
    `;
    return;
  }

  container.innerHTML = movies
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

  if (isFallback) {
    showToast('Viewing demo movie preview. Connect backend to view live MongoDB data.', 'info');
  }
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

/**
 * Toast Notification Helper
 */
function showToast(message, type = 'info') {
  let toastContainer = document.querySelector('.toast-container');
  if (!toastContainer) {
    toastContainer = document.createElement('div');
    toastContainer.className = 'toast-container';
    document.body.appendChild(toastContainer);
  }

  const toast = document.createElement('div');
  toast.className = `toast ${type === 'success' ? 'toast-success' : type === 'error' ? 'toast-error' : ''}`;
  toast.innerHTML = `<span>ℹ️</span> <div>${message}</div>`;
  toastContainer.appendChild(toast);

  setTimeout(() => {
    toast.remove();
  }, 4000);
}
