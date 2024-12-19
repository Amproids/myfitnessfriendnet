const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Test route
app.get('/api/test', (req, res) => {
  res.json({ message: 'Hello from Express!' });
});

app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});

const { exec } = require('child_process');

app.post('/webhooks', (req, res) => {
    console.log('Webhook received:', req.body);
    res.sendStatus(200);

    exec('~/myfitnessfriendnet/stop.sh && ~/myfitnessfriendnet/start.sh', (error, stdout, stderr) => {
        if (error) {
            console.error(`Error: ${error}`);
            return;
        }
        console.log(`Output: ${stdout}`);
    });
});