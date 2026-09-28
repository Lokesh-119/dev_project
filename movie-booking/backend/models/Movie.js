const mongoose = require('mongoose');

const movieSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Movie title is required'],
      trim: true,
    },
    description: {
      type: String,
      trim: true,
      default: '',
    },
    genre: {
      type: String,
      required: [true, 'Genre is required'],
      trim: true,
    },
    language: {
      type: String,
      required: [true, 'Language is required'],
      trim: true,
    },
    duration: {
      type: String,
      required: [true, 'Duration is required'],
      trim: true,
    },
    rating: {
      type: Number,
      default: 8.0,
      min: [0, 'Rating cannot be less than 0'],
      max: [10, 'Rating cannot be more than 10'],
    },
    poster: {
      type: String,
      default: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=800&auto=format&fit=crop&q=80',
    },
    price: {
      type: Number,
      default: 150,
      min: [0, 'Price cannot be negative'],
    },
    totalSeats: {
      type: Number,
      default: 40,
    },
    availableSeats: {
      type: Number,
      default: 40,
    },
    bookedSeats: {
      type: [String],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Movie', movieSchema);
