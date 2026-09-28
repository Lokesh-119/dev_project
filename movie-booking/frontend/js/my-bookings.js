/**
 * MovieBook - My Bookings Page Script
 * Interacts with:
 * - GET /api/bookings (Fetch all user bookings)
 * - DELETE /api/bookings/:id (Cancel booking)
 */

const API_BASE_URL = 'http://localhost:5000/api';

// Fallback demo bookings for offline preview
const fallbackBookings = [
  {
    _id: 'MB-847291',
    movieId: 'sample-avengers',
    movieTitle: 'Avengers: Endgame',
    customerName: 'Lokesh',
    selectedSeats: ['C4', 'C5'],
    totalAmount: 360,
    bookingDate: new Date().toISOString(),
  },
  {
    _id: 'MB-109482',
    movieId: 'sample-interstellar',
    movieTitle: 'Interstellar',
    customerName: 'Lokesh',
    selectedSeats: ['A1'],
    totalAmount: 150,
    bookingDate: new Date(Date.now() - 86400000).toISOString(),
  },
];

document.addEventListener('DOMContentLoaded', () => {
  setupMobileNav();
  loadBookings();
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
 * Load all bookings from Backend API
 */
async function loadBookings() {
  const container = document.getElementById('bookingsListContainer');
  if (!container) return;

  container.innerHTML = '<div class="spinner"></div>';

  try {
    const response = await fetch(`${API_BASE_URL}/bookings`);

    if (!response.ok) {
      throw new Error(`HTTP status: ${response.status}`);
    }

    const result = await response.json();
    const bookings = result.data || [];

    renderBookings(bookings, container, false);
  } catch (error) {
    console.warn('Backend API connection failed, showing demo bookings:', error.message);
    renderBookings(fallbackBookings, container, true);
  }
}

/**
 * Render bookings list into the DOM
 */
function renderBookings(bookings, container, isFallback = false) {
  if (!container) return;

  const countBadge = document.getElementById('bookingsCountBadge');
  if (countBadge) {
    countBadge.textContent = `${bookings.length} Reservation${bookings.length === 1 ? '' : 's'}`;
  }

  if (bookings.length === 0) {
    container.innerHTML = `
      <div class="empty-state">
        <div class="empty-icon">🎟️</div>
        <h3 class="empty-title">No Bookings Yet</h3>
        <p class="empty-text">You haven't booked any movie tickets yet. Browse our collection and grab your seat!</p>
        <a href="movies.html" class="btn btn-primary">
          Explore Movies & Book Now
        </a>
      </div>
    `;
    return;
  }

  container.innerHTML = bookings
    .map((b) => {
      const formattedDate = new Date(b.bookingDate || Date.now()).toLocaleDateString('en-US', {
        weekday: 'short',
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });

      const seatsHtml = (Array.isArray(b.selectedSeats) ? b.selectedSeats : [b.selectedSeats])
        .map((s) => `<span class="selected-seat-tag">${s}</span>`)
        .join('');

      return `
      <div class="booking-ticket-card" id="bookingCard-${b._id}">
        <div class="ticket-left">
          <div style="font-size: 0.8rem; color: #a5b4fc; font-family: monospace; font-weight: 700;">
            REF: ${b._id}
          </div>
          <h2 class="ticket-movie-title">${b.movieTitle || 'Movie'}</h2>
          
          <div class="ticket-meta">
            <span>👤 Booked by: <strong>${b.customerName}</strong></span>
            <span>📅 ${formattedDate}</span>
          </div>

          <div class="ticket-seats-wrap">
            <span style="font-size: 0.85rem; color: var(--text-muted);">Seats:</span>
            ${seatsHtml}
          </div>
        </div>

        <div class="ticket-right">
          <div class="ticket-amount">
            <div class="amount-label">Total Paid</div>
            <div class="amount-value">₹${b.totalAmount}</div>
          </div>
          <button 
            type="button" 
            class="btn btn-danger" 
            style="font-size: 0.85rem; padding: 8px 14px;"
            onclick="cancelBooking('${b._id}')"
          >
            Cancel Booking
          </button>
        </div>
      </div>
    `;
    })
    .join('');

  if (isFallback) {
    showToast('Showing preview demo bookings. Connect backend to view live MongoDB records.', 'info');
  }
}

/**
 * Cancel a booking via DELETE /api/bookings/:id
 */
async function cancelBooking(bookingId) {
  const confirmed = window.confirm('Are you sure you want to cancel this booking? The reserved seats will be released.');
  if (!confirmed) return;

  try {
    const response = await fetch(`${API_BASE_URL}/bookings/${bookingId}`, {
      method: 'DELETE',
    });

    const data = await response.json();

    if (response.ok && data.success) {
      showToast('Booking cancelled successfully and seats released!', 'success');
      // Remove card from UI or reload
      const card = document.getElementById(`bookingCard-${bookingId}`);
      if (card) {
        card.style.opacity = '0';
        card.style.transform = 'translateY(10px)';
        setTimeout(() => card.remove(), 300);
      } else {
        loadBookings();
      }
    } else {
      showToast(data.message || 'Failed to cancel booking', 'error');
    }
  } catch (err) {
    console.warn('API error cancelling booking, demonstrating locally:', err.message);
    showToast('Booking cancelled (Preview Mode)', 'success');
    const card = document.getElementById(`bookingCard-${bookingId}`);
    if (card) card.remove();
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
