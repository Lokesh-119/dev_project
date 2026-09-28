const express = require('express');
const router = express.Router();
const {
  getMovies,
  getMovieById,
  createMovie,
  deleteMovie,
} = require('../controllers/movieController');

// Routes for /api/movies
router.route('/').get(getMovies).post(createMovie);

// Routes for /api/movies/:id
router.route('/:id').get(getMovieById).delete(deleteMovie);

module.exports = router;
