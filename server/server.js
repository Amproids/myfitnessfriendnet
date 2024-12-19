const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();
const { exec } = require('child_process');
const os = require('os');

const app = express();
const port = process.env.PORT || 3001;

app.use(cors());
app.use(express.json()); // Only need express.json() for body parsing

// Serve static files from the 'dist' directory
app.use(express.static(path.join(__dirname, '../client/dist')));

// Handle the root route
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/dist', 'index.html'));
});

app.listen(port, '0.0.0.0', () => {
  console.log(`Server is running on port: ${port}`);
});
