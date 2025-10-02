// server.js
require('dotenv').config();
const express = require('express');
const app = express();

app.use(express.json());

const PORT = process.env.PORT || 3000;

app.get('/', (req, res) => res.send('API is running'));

app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
