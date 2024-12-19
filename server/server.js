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
        console.log('Webhook received');  // Log to confirm if request is hitting this endpoint

        const payload = req.body;
        console.log("Payload:", payload);  // Log the payload to check for correctness

        // Check if this is a valid GitHub push event
        if (payload.ref && payload.ref.startsWith('refs/heads/')) {
            console.log('GitHub Push Event:', payload);

            const deployDir = path.join(os.homedir(), 'myfitnessfriendnet');
            const redeployScript = path.join(deployDir, 'redeploy.sh');

            // Log the paths of the directories and scripts
            console.log(`Deploying from: ${deployDir}`);
            console.log(`Redeploy script: ${redeployScript}`);

            // Ensure the redeploy.sh script is executable
            exec(`chmod +x ${redeployScript}`, (chmodError, chmodStdout, chmodStderr) => {
                if (chmodError) {
                    console.error('Error making redeploy.sh executable:', chmodError);
                    console.error('chmod stderr:', chmodStderr);
                    res.status(500).send('Internal Server Error: Failed to set permissions');
                    return;
                }
                console.log('Successfully made redeploy.sh executable');

                // Execute the deployment script
                exec(
                    `cd ${deployDir} && ./redeploy.sh`,
                    { maxBuffer: 1024 * 1024 },
                    (error, stdout, stderr) => {
                        if (error) {
                            console.error(`Error executing redeploy: ${error.message}`);
                            console.error('stdout:', stdout);
                            console.error('stderr:', stderr);
                            res.status(500).send('Internal Server Error');
                            return;
                        }
                        if (stderr) {
                            console.error('stderr:', stderr);
                            res.status(500).send('Internal Server Error');
                            return;
                        }
                        console.log(`Deployment output:\n${stdout}`);
                        res.status(200).send('Webhook received and deployment triggered');
                    }
                );
            });
        } else {
            // If the payload doesn't correspond to a valid push event
            console.log("Invalid Push Event, no ref match.");
            res.status(400).send('Invalid GitHub Push Event');
        }
    } catch (error) {
        // Catch any unexpected errors
        console.error('Error in webhook handler:', error);
        res.status(500).send('Internal Server Error: ' + error);
    }
});

