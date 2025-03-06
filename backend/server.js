const express = require('express');
const dotenv = require('dotenv');

// Load config
dotenv.config({ path: './.env' });

const app = express();

// Body parser middleware
app.use(express.json());

// Define routes
app.get('/', (req, res) => {
    res.send('PatwaToli backend initialized');
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
