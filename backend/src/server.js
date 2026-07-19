const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const connectDB = require('./config/database');
const config = require('./config/env');
const errorHandler = require('./middleware/errorHandler');
const notFound = require('./middleware/notFound');

// Route imports
const chemicalRoutes = require('./routes/chemicalRoutes');
const reactionRoutes = require('./routes/reactionRoutes');
const quizRoutes = require('./routes/quizRoutes');
const searchRoutes = require('./routes/searchRoutes');
const statsRoutes = require('./routes/statsRoutes');

const app = express();

// Security middleware
app.use(helmet());

// CORS
app.use(cors({
  origin: config.frontendUrl,
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type']
}));

// Body parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Request logging
if (config.nodeEnv === 'development') {
  app.use(morgan('dev'));
}

// API Routes
app.use('/api/chemicals', chemicalRoutes);
app.use('/api/reactions', reactionRoutes);
app.use('/api/quizzes', quizRoutes);
app.use('/api/search', searchRoutes);
app.use('/api/stats', statsRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: 'ChemLab API is running',
    timestamp: new Date().toISOString()
  });
});

// Error handling
app.use(notFound);
app.use(errorHandler);

// Start server
const startServer = async () => {
  try {
    await connectDB();
    app.listen(config.port, () => {
      console.log(`\n🧪 ChemLab API Server`);
      console.log(`   Environment: ${config.nodeEnv}`);
      console.log(`   Port: ${config.port}`);
      console.log(`   Frontend: ${config.frontendUrl}`);
      console.log(`   API: http://localhost:${config.port}/api\n`);
    });
  } catch (error) {
    console.error('Failed to start server:', error.message);
    process.exit(1);
  }
};

startServer();
