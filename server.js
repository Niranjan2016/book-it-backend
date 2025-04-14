
const express = require('express');
const cors = require('cors');
const path = require('path');
const swaggerUi = require('swagger-ui-express');
const swaggerJsDoc = require('swagger-jsdoc');
require('./models/index'); // Add this line
require('dotenv').config();
const app = require('./app');
const db = require('./config/database');

const PORT = process.env.PORT || 5000;

// Test database connection before starting server
async function startServer() {
  try {
    await db.authenticate();
    console.log('Database connection established successfully.');

    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
      console.log(`API Documentation available at http://localhost:${PORT}/api-docs`);
    });
  } catch (error) {
    console.error('Unable to connect to the database:', error);
    process.exit(1);
  }
}

startServer();
// Swagger Options
// Update Swagger Options with absolute path
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Book-It API',
      version: '1.0.0',
      description: 'API documentation for Book-It application'
    },
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT'
        }
      }
    },
    security: [{
      bearerAuth: []
    }]
  },
  apis: [path.join(__dirname, './docs', 'swaggerDocs', '*.js')]
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// Enable CORS
// Update CORS configuration
const corsOptions = {
  origin: ['http://localhost:3000', 'http://localhost:5000', 'http://localhost:5173'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Access-Control-Allow-Origin'],
  exposedHeaders: ['Content-Range', 'X-Content-Range']
};

app.use(cors(corsOptions));

// Add pre-flight handling
app.options('*', cors(corsOptions));
// Ensure this middleware comes before your routes
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Remove duplicate route and organize routes
app.get('/test', (req, res) => {
  res.json({ message: 'API is working' });
});

// API Routes
app.use('/api/contact', require(path.join(__dirname, 'routes/contactRoutes')));
app.use('/api/auth', require(path.join(__dirname, 'routes/authRoutes')));
// Import routes
const userRoutes = require('./routes/userRoutes');
app.use('/api/users', userRoutes);
app.use('/api/venues', require(path.join(__dirname, 'routes/venueRoutes')));
app.use('/api/seats', require(path.join(__dirname, 'routes/seatRoutes')));
app.use('/api/reviews', require(path.join(__dirname, 'routes/reviewRoutes')));
app.use('/api/payments', require(path.join(__dirname, 'routes/paymentRoutes')));
app.use('/api/events', require(path.join(__dirname, 'routes/eventroutes')));
app.use('/api/bookings', require(path.join(__dirname, 'routes/bookingRoutes')));
app.use('/api/categories', require(path.join(__dirname, 'routes/categoryRoutes')));

// Remove duplicate sync and use only one with force option
db.sync();

console.log('Starting Server');
// Remove the second sync operation that was here