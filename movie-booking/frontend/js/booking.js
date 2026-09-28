/**
 * MovieBook - Movie Details & Seat Booking Script
 * Interacts with:
 * - GET /api/movies/:id (Fetch movie details & booked seats)
 * - POST /api/bookings (Confirm and store booking)
 */

const API_BASE_URL = 'http://localhost:5000/api';

// Current active movie and selected seats state
let currentMovie = null;
let selectedSeats = [];
const SEAT_ROWS = ['A', 'B', 'C', 'D', 'E'];
const SEATS_PER_ROW = 8;

// Fallback movie details for offline preview
const sampleMovieMap = {
  'sample-interstellar': {
    _id: 'sample-interstellar',
    title: 'Interstellar',
    description: 'When Earth becomes uninhabitable in the future, a farmer and ex-NASA pilot, Joseph Cooper, is tasked to pilot a spacecraft along with a team of researchers to find a new planet for humans.',
    genre: 'Sci-Fi / Adventure',
    language: 'English',
    duration: '169 min',
    rating: 8.7,
    price: 150,
    poster: 'https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?w=800&auto=format&fit=crop&q=80',
    availableSeats: 37,
    bookedSeats: ['A1', 'B4', 'C2'],
  },
  'sample-inception': {
    _id: 'sample-inception',
    title: 'Inception',
    description: 'A thief who steals corporate secrets through the use of dream-sharing technology is given the inverse task of planting an idea into the mind of a C.E.O.',
    genre: 'Sci-Fi / Action',
    language: 'English',
    duration: '148 min',
    rating: 8.8,
    price: 150,
    poster: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=800&auto=format&fit=crop&q=80',
    availableSeats: 38,
    bookedSeats: ['B1', 'B2'],
  },
};

document.addEventListener('DOMContentLoaded', () => {
  setupMobileNav();
  setupBookingForm();
  loadMovieDetails();
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
 * Load Movie Details from Backend API
 */
async function loadMovieDetails() {
  const params = new URLSearchParams(window.location.search);
  let movieId = params.get('id');

  // Check sessionStorage fallback if static server stripped query parameters
  if (!movieId) {
    movieId = sessionStorage.getItem('selectedMovieId');
  }

  // If still no movieId, dynamically pick the first available movie from the API
  if (!movieId) {
    try {
      const res = await fetch(`${API_BASE_URL}/movies`);
      if (res.ok) {
        const list = await res.json();
        if (list.data && list.data.length > 0) {
          movieId = list.data[0]._id;
        }
      }
    } catch (e) {
      movieId = 'sample-interstellar';
    }
  }

  if (!movieId) {
    movieId = 'sample-interstellar';
  }

  sessionStorage.setItem('selectedMovieId', movieId);

  try {
    const response = await fetch(`${API_BASE_URL}/movies/${movieId}`);

    if (response.ok) {
      const result = await response.json();
      currentMovie = result.data;
    } else {
      // Check fallback map or create sample
      currentMovie = sampleMovieMap[movieId] || {
        _id: movieId,
        title: 'Interstellar',
        description: 'A journey beyond the stars to find a new home for mankind.',
        genre: 'Sci-Fi / Adventure',
        language: 'English',
        duration: '169 min',
        rating: 8.7,
        price: 150,
        poster: 'https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?w=800&auto=format&fit=crop&q=80',
        availableSeats: 37,
        bookedSeats: ['A1', 'B4', 'C2'],
      };
    }
  } catch (err) {
    console.warn('API error, using sample movie details:', err.message);
    currentMovie = sampleMovieMap[movieId] || {
      _id: movieId,
      title: 'Interstellar',
      description: 'A journey beyond the stars to find a new home for mankind.',
      genre: 'Sci-Fi / Adventure',
      language: 'English',
      duration: '169 min',
      rating: 8.7,
      price: 150,
      poster: 'https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?w=800&auto=format&fit=crop&q=80',
      availableSeats: 37,
      bookedSeats: ['A1', 'B4', 'C2'],
    };
  }

  renderMovieDetails(currentMovie);
  renderSeatMatrix(currentMovie.bookedSeats || []);
  updatePriceCalculation();
}

/**
 * Render Movie Details Header & Preview
 */
function renderMovieDetails(movie) {
  // Mini preview in summary card
  const miniPoster = document.getElementById('summaryMoviePoster');
  const miniTitle = document.getElementById('summaryMovieTitle');
  const miniMeta = document.getElementById('summaryMovieMeta');
  const ticketPriceDisplay = document.getElementById('ticketPriceDisplay');

  if (miniPoster) {
    miniPoster.src = movie.poster || 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=800&auto=format&fit=crop&q=80';
    miniPoster.alt = movie.title;
  }
  if (miniTitle) miniTitle.textContent = movie.title;
  if (miniMeta) {
    miniMeta.innerHTML = `
      <span class="badge badge-genre">${movie.genre}</span>
      <span class="badge badge-lang">${movie.language}</span>
      <span class="badge badge-rating">⭐ ${movie.rating || 8.0}</span>
    `;
  }
  if (ticketPriceDisplay) {
    ticketPriceDisplay.textContent = `₹${movie.price || 150}`;
  }

  // Header Details Banner
  const titleElem = document.getElementById('movieHeaderTitle');
  const descElem = document.getElementById('movieHeaderDesc');
  const durationElem = document.getElementById('movieHeaderDuration');

  if (titleElem) titleElem.textContent = movie.title;
  if (descElem) descElem.textContent = movie.description || 'Experience this cinematic masterpiece on the big screen.';
  if (durationElem) durationElem.textContent = `⏱️ ${movie.duration} | 🗣️ ${movie.language}`;
}

/**
 * Generate Theatre Seat Grid
 */
function renderSeatMatrix(bookedSeats = []) {
  const matrixContainer = document.getElementById('seatMatrix');
  if (!matrixContainer) return;

  matrixContainer.innerHTML = '';

  SEAT_ROWS.forEach((rowLetter) => {
    const rowDiv = document.createElement('div');
    rowDiv.className = 'seat-row';

    const rowLabel = document.createElement('div');
    rowLabel.className = 'row-label';
    rowLabel.textContent = rowLetter;
    rowDiv.appendChild(rowLabel);

    const groupDiv = document.createElement('div');
    groupDiv.className = 'seats-group';

    for (let seatNum = 1; seatNum <= SEATS_PER_ROW; seatNum++) {
      const seatId = `${rowLetter}${seatNum}`;
      const seatDiv = document.createElement('div');
      seatDiv.className = 'seat';
      seatDiv.textContent = seatId;
      seatDiv.dataset.seat = seatId;

      if (bookedSeats.includes(seatId)) {
        seatDiv.classList.add('booked');
        seatDiv.title = `Seat ${seatId} is already booked`;
      } else {
        seatDiv.title = `Select seat ${seatId}`;
        seatDiv.addEventListener('click', () => toggleSeatSelection(seatId, seatDiv));
      }

      groupDiv.appendChild(seatDiv);
    }

    rowDiv.appendChild(groupDiv);
    matrixContainer.appendChild(rowDiv);
  });
}

/**
 * Handle seat click selection/deselection
 */
function toggleSeatSelection(seatId, seatElem) {
  if (selectedSeats.includes(seatId)) {
    // Deselect
    selectedSeats = selectedSeats.filter((s) => s !== seatId);
    seatElem.classList.remove('selected');
  } else {
    // Select
    selectedSeats.push(seatId);
    selectedSeats.sort();
    seatElem.classList.add('selected');
  }

  updatePriceCalculation();
}

/**
 * Update Selected Seats List and Calculate Total Price
 * Requirement:
 * Ticket price = ₹150
 * If 3 seats: Total = ₹450
 */
function updatePriceCalculation() {
  const container = document.getElementById('selectedSeatsDisplay');
  const countDisplay = document.getElementById('selectedCountDisplay');
  const totalDisplay = document.getElementById('totalAmountDisplay');
  const confirmBtn = document.getElementById('confirmBookingBtn');

  const pricePerSeat = currentMovie ? currentMovie.price || 150 : 150;
  const count = selectedSeats.length;
  const totalAmount = count * pricePerSeat;

  // Render selected seat pills
  if (container) {
    if (selectedSeats.length === 0) {
      container.innerHTML = '<span style="color: var(--text-muted); font-size: 0.88rem;">No seats selected yet. Click on the seats above to select.</span>';
    } else {
      container.innerHTML = selectedSeats
        .map((seat) => `<span class="selected-seat-tag">${seat}</span>`)
        .join('');
    }
  }

  if (countDisplay) countDisplay.textContent = count;
  if (totalDisplay) totalDisplay.textContent = `₹${totalAmount}`;

  // Enable/Disable confirm button
  if (confirmBtn) {
    confirmBtn.disabled = count === 0;
    confirmBtn.textContent = count === 0 ? 'Select Seats to Proceed' : `Confirm Booking • ₹${totalAmount}`;
  }
}

/**
 * Setup form submit handler for Confirm Booking
 * Requirement:
 * POST /api/bookings
 * Request body:
 * {
 *   "movieId": "...",
 *   "movieTitle": "Avengers",
 *   "customerName": "Lokesh",
 *   "selectedSeats": ["A1", "A2"],
 *   "totalAmount": 300
 * }
 */
function setupBookingForm() {
  const form = document.getElementById('bookingForm');
  const confirmBtn = document.getElementById('confirmBookingBtn');

  if (form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();

      const customerNameInput = document.getElementById('customerNameInput');
      const customerName = (customerNameInput?.value || '').trim();

      if (!customerName) {
        showToast('Please enter your name to confirm booking', 'error');
        customerNameInput?.focus();
        return;
      }

      if (selectedSeats.length === 0) {
        showToast('Please select at least one seat', 'error');
        return;
      }

      const pricePerSeat = currentMovie ? currentMovie.price || 150 : 150;
      const totalAmount = selectedSeats.length * pricePerSeat;

      const payload = {
        movieId: currentMovie._id,
        movieTitle: currentMovie.title,
        customerName: customerName,
        selectedSeats: selectedSeats,
        totalAmount: totalAmount,
      };

      try {
        confirmBtn.disabled = true;
        confirmBtn.innerHTML = '⏳ Confirming Booking...';

        const response = await fetch(`${API_BASE_URL}/bookings`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload),
        });

        const data = await response.json();

        if (response.ok && data.success) {
          showConfirmationModal(data.data || payload);
          // Mark selected seats as booked locally
          selectedSeats.forEach((seatId) => {
            const seatElem = document.querySelector(`.seat[data-seat="${seatId}"]`);
            if (seatElem) {
              seatElem.classList.remove('selected');
              seatElem.classList.add('booked');
            }
          });
          selectedSeats = [];
          updatePriceCalculation();
        } else {
          showToast(data.message || 'Failed to create booking. Please try again.', 'error');
        }
      } catch (err) {
        console.warn('Booking API error, demonstrating offline confirmation:', err.message);
        // Fallback for demonstration if MongoDB / backend is not yet started
        const mockBooking = {
          _id: 'MB-' + Math.floor(100000 + Math.random() * 900000),
          movieId: currentMovie._id,
          movieTitle: currentMovie.title,
          customerName: customerName,
          selectedSeats: selectedSeats,
          totalAmount: totalAmount,
          bookingDate: new Date().toISOString(),
        };
        showConfirmationModal(mockBooking);
      } finally {
        confirmBtn.disabled = false;
        confirmBtn.innerHTML = `Confirm Booking • ₹${totalAmount}`;
      }
    });
  }
}

/**
 * Display Success Confirmation Modal with ticket details
 */
function showConfirmationModal(booking) {
  const modal = document.getElementById('confirmationModal');
  if (!modal) return;

  const dateFormatted = new Date(booking.bookingDate || Date.now()).toLocaleString();

  document.getElementById('receiptBookingId').textContent = booking._id || 'MB-' + Math.floor(100000 + Math.random() * 900000);
  document.getElementById('receiptMovieTitle').textContent = booking.movieTitle;
  document.getElementById('receiptCustomerName').textContent = booking.customerName;
  document.getElementById('receiptSeats').textContent = Array.isArray(booking.selectedSeats) ? booking.selectedSeats.join(', ') : booking.selectedSeats;
  document.getElementById('receiptTotal').textContent = `₹${booking.totalAmount}`;
  document.getElementById('receiptDate').textContent = dateFormatted;

  modal.classList.add('show');
}

/**
 * Close modal
 */
function closeModal() {
  const modal = document.getElementById('confirmationModal');
  if (modal) {
    modal.classList.remove('show');
  }
}

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
