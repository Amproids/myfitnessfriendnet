const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Serve static files from the 'dist' directory
app.use(express.static(path.join(__dirname, '../client/dist'))); 

// Handle the root route
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/dist', 'index.html'));
  });

app.listen(port, '0.0.0.0', () => {
  console.log(`Server is running on port: ${port}`);
});

const { exec } = require('child_process');

app.post('/webhook', (req, res) => {
    res.sendStatus(200);
    
    console.log('Current user:', require('os').userInfo().username);
    console.log('Current directory:', process.cwd());
    
    exec('whoami', (error, stdout) => console.log('Executing as:', stdout));
  });