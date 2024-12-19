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

app.post('/webhook', (req, res) => {
    try {
        const githubPayload = req.body;

        if (!githubPayload.ref || !githubPayload.ref.startsWith('refs/heads/')) {
            console.log("Invalid Push Event, no ref match.");
            res.status(400).send('Invalid GitHub Push Event');
            return;
        }

        const deployDir = path.join(os.homedir(), 'myfitnessfriendnet');
        const redeployScript = path.join(deployDir, 'redeploy.sh');

        // Ensure the redeploy.sh script is executable
        exec(`chmod +x ${redeployScript}`, (chmodError) => {
            if (chmodError) {
                console.error('Error making redeploy.sh executable:', chmodError);
                res.status(500).send('Internal Server Error: Failed to set permissions');
                return;
            }

            // Execute the deployment script
            exec(
                `cd ${deployDir} && ./redeploy.sh`,
                { maxBuffer: 1024 * 1024 },
                (error, stdout, stderr) => {
                    if (error) {
                        console.error(`Error executing redeploy: ${error.message}`);
                        res.status(500).send('Internal Server Error');
                        return;
                    }
                    if (stderr) {
                        console.error('stderr:', stderr);
                        res.status(500).send('Internal Server Error');
                        return;
                    }
                    res.status(200).send('Webhook received and deployment triggered');
                }
            );
        });
    } catch (error) {
        console.error('Error in webhook handler:', error);
        res.status(500).send('Internal Server Error: ' + error);
    }
});

