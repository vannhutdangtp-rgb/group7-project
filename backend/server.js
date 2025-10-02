// backend/server.js
require('dotenv').config();
const express = require('express');
const app = express();

app.use(express.json());

// Routes
const userRoutes = require('./routes/user');
app.use('/api/users', userRoutes);

// Root test
app.get('/', (req, res) => res.send('API is running'));

// PORT
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));