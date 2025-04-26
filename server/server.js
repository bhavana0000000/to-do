const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection (Updated)
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/your-database-name'; // Fallback URI

mongoose.connect(MONGO_URI, {
  useNewUrlParser: true,    // Not needed for Mongoose v6+, but harmless
  useUnifiedTopology: true  // Not needed for Mongoose v6+, but harmless
})
.then(() => console.log('MongoDB Connected'))
.catch(err => console.error('MongoDB Connection Error:', err));

// Connection event listeners
mongoose.connection.on('connected', () => {
  console.log(`Connected to MongoDB at ${MONGO_URI}`);
});

mongoose.connection.on('error', (err) => {
  console.error('MongoDB connection error:', err);
});

// Routes
const authRoutes = require('./routes/auth');
const taskRoutes = require('./routes/tasks');

app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});