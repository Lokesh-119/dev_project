const dotenv = require('dotenv');
const mongoose = require('mongoose');
const Movie = require('./models/Movie');
const Booking = require('./models/Booking');

dotenv.config();

const sampleMovies = [
  {
    title: 'Interstellar',
    description: 'When Earth becomes uninhabitable in the future, a farmer and ex-NASA pilot, Joseph Cooper, is tasked to pilot a spacecraft, along with a team of researchers, to find a new planet for humans.',
    genre: 'Sci-Fi / Adventure',
    language: 'English',
    duration: '169 min',
    rating: 8.7,
    poster: 'https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?w=800&auto=format&fit=crop&q=80',
    price: 150,
    totalSeats: 40,
    availableSeats: 37,
    bookedSeats: ['A1', 'B4', 'C2'],
  },
  {
    title: 'Inception',
    description: 'A thief who steals corporate secrets through the use of dream-sharing technology is given the inverse task of planting an idea into the mind of a C.E.O., but his tragic past may doom the project.',
    genre: 'Sci-Fi / Action',
    language: 'English',
    duration: '148 min',
    rating: 8.8,
    poster: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=800&auto=format&fit=crop&q=80',
    price: 150,
    totalSeats: 40,
    availableSeats: 38,
    bookedSeats: ['B1', 'B2'],
  },
  {
    title: 'Avengers: Endgame',
    description: 'After the devastating events of Avengers: Infinity War, the universe is in ruins. With the help of remaining allies, the Avengers assemble once more in order to reverse Thanos\' actions and restore balance to the universe.',
    genre: 'Action / Sci-Fi',
    language: 'English',
    duration: '181 min',
    rating: 8.4,
    poster: 'https://images.unsplash.com/photo-1568832359672-e36cf5d74f54?w=800&auto=format&fit=crop&q=80',
    price: 180,
    totalSeats: 40,
    availableSeats: 36,
    bookedSeats: ['C4', 'C5', 'D1', 'D2'],
  },
  {
    title: 'Spider-Man: No Way Home',
    description: 'With Spider-Man\'s identity now revealed, Peter asks Doctor Strange for help. When a spell goes wrong, dangerous foes from other worlds start to appear, forcing Peter to discover what it truly means to be Spider-Man.',
    genre: 'Action / Adventure',
    language: 'English',
    duration: '148 min',
    rating: 8.2,
    poster: 'https://images.unsplash.com/photo-1635805737707-575885ab0820?w=800&auto=format&fit=crop&q=80',
    price: 150,
    totalSeats: 40,
    availableSeats: 39,
    bookedSeats: ['A5'],
  },
  {
    title: 'The Dark Knight',
    description: 'When the menace known as the Joker wreaks havoc and chaos on the people of Gotham, Batman must accept one of the greatest psychological and physical tests of his ability to fight injustice.',
    genre: 'Action / Crime / Drama',
    language: 'English',
    duration: '152 min',
    rating: 9.0,
    poster: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=800&auto=format&fit=crop&q=80',
    price: 150,
    totalSeats: 40,
    availableSeats: 37,
    bookedSeats: ['D4', 'D5', 'E1'],
  },
  {
    title: 'RRR',
    description: 'A fearless warrior on a perilous mission comes face to face with a steely cop serving British forces in pre-independent India, leading to an epic tale of friendship and freedom.',
    genre: 'Action / Drama',
    language: 'Telugu / Hindi',
    duration: '182 min',
    rating: 8.0,
    poster: 'https://images.unsplash.com/photo-1518676590629-3dcbd9c5a5c9?w=800&auto=format&fit=crop&q=80',
    price: 160,
    totalSeats: 40,
    availableSeats: 40,
    bookedSeats: [],
  },
];

const seedData = async () => {
  try {
    const mongoUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/movie-booking';
    await mongoose.connect(mongoUri);
    console.log('Connected to MongoDB for seeding...');

    if (process.argv[2] === '-d' || process.argv[2] === '--destroy') {
      await Movie.deleteMany();
      await Booking.deleteMany();
      console.log('🗑️  All Movies and Bookings destroyed!');
      process.exit(0);
    }

    // Clear existing movies and bookings
    await Movie.deleteMany();
    await Booking.deleteMany();
    console.log('Cleaned existing collections.');

    // Insert sample movies
    const createdMovies = await Movie.insertMany(sampleMovies);
    console.log(`✅ Successfully seeded ${createdMovies.length} movies!`);

    // Optionally create a sample booking for demonstration
    if (createdMovies.length > 0) {
      const sampleMovie = createdMovies[0]; // Interstellar
      await Booking.create({
        movieId: sampleMovie._id,
        movieTitle: sampleMovie.title,
        customerName: 'Lokesh',
        selectedSeats: ['A1', 'B4', 'C2'],
        totalAmount: sampleMovie.price * 3,
        bookingDate: new Date(),
      });
      console.log('✅ Created 1 sample initial booking for Lokesh.');
    }

    console.log('🎉 Seeding complete!');
    process.exit(0);
  } catch (error) {
    console.error(`❌ Seeding error: ${error.message}`);
    process.exit(1);
  }
};

seedData();
