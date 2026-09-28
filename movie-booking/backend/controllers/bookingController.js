const Booking = require('../models/Booking');
const Movie = require('../models/Movie');

/**
 * @desc    Get all bookings
 * @route   GET /api/bookings
 * @access  Public
 */
const getBookings = async (req, res, next) => {
  try {
    const bookings = await Booking.find().sort({ bookingDate: -1 });

    res.status(200).json({
      success: true,
      message: 'Bookings fetched successfully',
      count: bookings.length,
      data: bookings,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get a single booking by ID
 * @route   GET /api/bookings/:id
 * @access  Public
 */
const getBookingById = async (req, res, next) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Booking fetched successfully',
      data: booking,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Create a new booking and reserve seats
 * @route   POST /api/bookings
 * @access  Public
 */
const createBooking = async (req, res, next) => {
  try {
    const { movieId, movieTitle, customerName, selectedSeats, totalAmount } = req.body;

    // Validation
    if (!movieId || !customerName || !selectedSeats || !Array.isArray(selectedSeats) || selectedSeats.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Please provide movieId, customerName, and at least one selectedSeat',
      });
    }

    // Check if the movie exists
    const movie = await Movie.findById(movieId);
    if (!movie) {
      return res.status(404).json({
        success: false,
        message: 'Movie not found',
      });
    }

    // Check if any selected seat is already booked
    const alreadyBooked = selectedSeats.filter((seat) => movie.bookedSeats.includes(seat));
    if (alreadyBooked.length > 0) {
      return res.status(400).json({
        success: false,
        message: `Seat(s) ${alreadyBooked.join(', ')} already booked. Please choose available seats.`,
      });
    }

    // Calculate total amount if not provided
    const calculatedTotal = totalAmount !== undefined ? Number(totalAmount) : selectedSeats.length * (movie.price || 150);

    // Create the booking
    const booking = await Booking.create({
      movieId: movie._id,
      movieTitle: movieTitle || movie.title,
      customerName,
      selectedSeats,
      totalAmount: calculatedTotal,
      bookingDate: new Date(),
    });

    // Update movie booked seats and available seats
    movie.bookedSeats.push(...selectedSeats);
    movie.availableSeats = Math.max(0, movie.availableSeats - selectedSeats.length);
    await movie.save();

    res.status(201).json({
      success: true,
      message: 'Booking Confirmed!',
      data: booking,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Cancel a booking and release reserved seats
 * @route   DELETE /api/bookings/:id
 * @access  Public
 */
const deleteBooking = async (req, res, next) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found',
      });
    }

    // Release seats in the Movie document if movie still exists
    if (booking.movieId) {
      const movie = await Movie.findById(booking.movieId);
      if (movie) {
        movie.bookedSeats = movie.bookedSeats.filter((seat) => !booking.selectedSeats.includes(seat));
        movie.availableSeats = Math.min(movie.totalSeats || 40, movie.availableSeats + booking.selectedSeats.length);
        await movie.save();
      }
    }

    await Booking.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Booking cancelled successfully',
      data: { id: req.params.id },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getBookings,
  getBookingById,
  createBooking,
  deleteBooking,
};
