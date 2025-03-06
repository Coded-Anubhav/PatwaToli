const express = require('express');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Load config
dotenv.config({ path: './.env' });

const app = express();

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log('MongoDB connected');
}).catch(err => {
  console.error(err);
});

// Body parser middleware
app.use(express.json());

// User model
const UserSchema = new mongoose.Schema({
  username: String,
  password: String
});
const User = mongoose.model('User', UserSchema);

// Register route
app.post('/register', async (req, res) => {
  const { username, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);
  const user = new User({ username, password: hashedPassword });
  await user.save();
  res.status(201).send('User registered');
});

// Login route
app.post('/login', async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findOne({ username });
  if (!user || !await bcrypt.compare(password, user.password)) {
    return res.status(401).send('Invalid credentials');
  }
  const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET);
  res.send({ token });
});

// Define routes
app.get('/', (req, res) => {
  res.send('PatwaToli backend initialized');
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
