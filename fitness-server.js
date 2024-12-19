const express = require('express');
const app = express();
const port = 3001;

//handle json payloads
app.use(express.json());

//root route
app.get('/', (req, res) => {
  res.json({ message: 'Webhook test 15. Hi Anja, my love! :) <3' });
});

//base page route

//Webhook endpoint
app.post('/webhook', async (req, res) => {
  if (req.body.ref === 'refs/heads/main') {
    try {
      const { exec } = require('child_process');
      res.status(200).send('Deploy initiated');
      exec('./webhook.sh', 
        (error, stdout) => {
          if (error && !error.message.includes('pkill')) {
            console.error(`Error: ${error}`);
            return res.status(500).send('Deploy failed');
          }
          console.log(stdout);
          res.status(200).send('Deployed successfully');
        }
      );
    } catch (error) {
      console.error(error);
      res.status(500).send(`${error}\nDeploy failed'`);
    }
  } else {
    res.status(200).send('Not main branch');
  }
});
  
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});