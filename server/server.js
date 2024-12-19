const express = require('express');
const cors = require('cors');
const path = require('path');
const bodyParser = require('body-parser');
require('dotenv').config();

const { exec } = require('child_process');
const os = require('os');

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

app.use(bodyParser.json());

app.post('/webhook', (req, res) => {
    const payload = req.body;
    exec(`echo "${JSON.stringify(payload)}" >> /home/andrew/myfitnessfriendnet/deploy.log`, { maxBuffer: 1024 * 1024 });

    // Make sure this is a valid GitHub push event
    if (payload.ref && payload.ref.startsWith('refs/heads/')) {
        console.log('GitHub Push Event:', payload);

        // Use an absolute path for the deployment directory
        const deployDir = path.join(os.homedir(), '/home/andrew/myfitnessfriendnet');
        const redeployScript = path.join(deployDir, 'redeploy.sh');

        exec(
            `cd ${deployDir} && ${redeployScript}`,
            { maxBuffer: 1024 * 1024 },
            (error, stdout, stderr) => {
                if (error) {
                    console.error(`Error executing redeploy: ${error.message}`);
                    res.status(500).send('Internal Server Error');
                    return;
                }
                if (stderr) {
                    console.error(`stderr: ${stderr}`);
                    res.status(500).send('Internal Server Error');
                    return;
                }
                console.log(`Deployment output:\n${stdout}`);
                res.status(200).send('Webhook received and deployment triggered');
            }
        );
    } else {
        // If the payload doesn't correspond to a push event
        res.status(400).send('Invalid GitHub Push Event');
    }
});
