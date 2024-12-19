const express = require('express');
const app = express();
const port = 3001;

//handle json payloads
app.use(express.json());

//root route
app.get('/', (req, res) => {
  res.json({ message: 'Webhook test 8. Hi Anja, my love! :) <3' });
});

//base page route

//Webhook endpoint
app.post('/webhook', async (req, res) => {
    if (req.body.ref === 'refs/heads/main') {
      // The push was to the main branch
        try {
            const { exec } = require('child_process');
            // Execute pull and npm install
            res.json({ webhook: 'webhook successful' });
            exec('beep && cd ~/myfitnessfriendnet && pkill -f "node fitness-server.js" && git pull && node fitness-server.js', (error, stdout, stderr) => {
                if (error) {
                    console.error(`Error: ${error}`);
                    return res.status(500).send('Deploy failed');
                }
                console.log(`Deployed successfully: ${stdout}`);
                res.status(200).send('Deployed successfully');
            });
        } catch (error) {
            console.error('Deploy failed:', error);
            res.status(500).send('Deploy failed');
        }
    } else {
        res.status(200).send('Not main branch, no action taken');
    }
});
  
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});