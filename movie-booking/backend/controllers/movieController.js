const Movie = require('../models/Movie');

/**
 * @desc    Get all movies (with optional search/filter)
 * @route   GET /api/movies
 * @access  Public
 */
const getMovies = async (req, res, next) => {
  try {
    const { search, genre, language } = req.query;
    let query = {};

    if (search) {
      query.title = { $regex: search, $options: 'i' };
    }
    if (genre && genre !== 'All') {
      query.genre = { $regex: genre, $options: 'i' };
    }
    if (language && language !== 'All') {
      query.language = { $regex: language, $options: 'i' };
    }

    const movies = await Movie.find(query).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      message: 'Movies fetched successfully',
      count: movies.length,
      data: movies,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get a single movie by ID
 * @route   GET /api/movies/:id
 * @access  Public
 */
const getMovieById = async (req, res, next) => {
  try {
    const movie = await Movie.findById(req.params.id);

    if (!movie) {
      return res.status(404).json({
        success: false,
        message: 'Movie not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Movie fetched successfully',
      data: movie,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Create a new movie
 * @route   POST /api/movies
 * @access  Public (simplified for DevOps learning)
 */
const createMovie = async (req, res, next) => {
  try {
    const { title, description, genre, language, duration, rating, poster, price, availableSeats, totalSeats } = req.body;

    if (!title || !genre || !language || !duration) {
      return res.status(400).json({
        success: false,
        message: 'Please provide title, genre, language, and duration',
      });
    }

    const movie = await Movie.create({
      title,
      description,
      genre,
      language,
      duration,
      rating: rating ? Number(rating) : 8.0,
      poster,
      price: price ? Number(price) : 150,
      totalSeats: totalSeats ? Number(totalSeats) : 40,
      availableSeats: availableSeats ? Number(availableSeats) : 40,
      bookedSeats: [],
    });

    res.status(201).json({
      success: true,
      message: 'Movie created successfully',
      data: movie,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Delete a movie by ID
 * @route   DELETE /api/movies/:id
 * @access  Public
 */
const deleteMovie = async (req, res, next) => {
  try {
    const movie = await Movie.findById(req.params.id);

    if (!movie) {
      return res.status(404).json({
        success: false,
        message: 'Movie not found',
      });
    }

    await Movie.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Movie deleted successfully',
      data: { id: req.params.id },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getMovies,
  getMovieById,
  createMovie,
  deleteMovie,
};
