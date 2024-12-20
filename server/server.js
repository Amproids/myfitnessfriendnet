// server.js
import express from 'express'
import cors from 'cors'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'
import dotenv from 'dotenv'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
dotenv.config()

const app = express()
const port = process.env.PORT || 3001

// Middleware
app.use(cors())
app.use(express.json())

// API Routes
app.get('/api/exercises', async (req, res) => {
    const { bodyPart, equipment, search } = req.query;
    const options = {
        method: 'GET',
        headers: {
            'x-rapidapi-host': 'exercisedb.p.rapidapi.com',
            'x-rapidapi-key': '2c199b73b1msh4a47f8a9a1e22eep18d021jsnf8edd3a01769'
        }
    };
  
    try {
        let url = 'https://exercisedb.p.rapidapi.com/exercises';
        
        // Add query parameters if they exist
        if (bodyPart && bodyPart !== 'all') {
            url = `https://exercisedb.p.rapidapi.com/exercises/bodyPart/${bodyPart}`;
        } else if (equipment && equipment !== 'all') {
            url = `https://exercisedb.p.rapidapi.com/exercises/equipment/${equipment}`;
        }
        
        console.log('Fetching from URL:', url); // Debug log
        const response = await fetch(url, options);
        
        if (!response.ok) {
            const errorText = await response.text();
            console.error('API Response not OK:', response.status, errorText);
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        let data = await response.json();
        
        // Apply search filter if it exists
        if (search) {
            const searchLower = search.toLowerCase();
            data = data.filter(exercise => 
                exercise.name.toLowerCase().includes(searchLower) ||
                exercise.bodyPart.toLowerCase().includes(searchLower) ||
                exercise.equipment.toLowerCase().includes(searchLower)
            );
        }
        
        res.json(data);
    } catch (error) {
        console.error('API Error:', error);
        res.status(500).json({ error: 'Failed to fetch exercises' });
    }
});

// Serve static files from the client directory
app.use(express.static(join(__dirname, '../client'), {
    setHeaders: (res, path) => {
        if (path.endsWith('.css')) {
            res.setHeader('Content-Type', 'text/css');
        }
    }
}));

// Page Routes
app.get('/', (req, res) => {
    res.sendFile(join(__dirname, '../client/src/pages/index.html'))
})

app.get('/exercises', (req, res) => {
    res.sendFile(join(__dirname, '../client/src/pages/exercises.html'))
})

app.get('/profile', (req, res) => {
    res.sendFile(join(__dirname, '../client/src/pages/profile.html'))
})

// 404 handler - should be last route
app.get('*', (req, res) => {
    res.sendFile(join(__dirname, '../client/src/pages/404.html'))
})

// Start the server
app.listen(port, '0.0.0.0', () => {
    console.log(`Server is running on port: ${port}`)
    console.log(`Serving files from: ${join(__dirname, '../client')}`)
})