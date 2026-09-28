const express = require('express');
const router = express.Router();
const {
  getBookings,
  getBookingById,
  createBooking,
  deleteBooking,
} = require('../controllers/bookingController');

// Routes for /api/bookings
router.route('/').get(getBookings).post(createBooking);

// Routes for /api/bookings/:id
router.route('/:id').get(getBookingById).delete(deleteBooking);

module.exports = router;
