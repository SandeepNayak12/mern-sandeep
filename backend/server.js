const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

// --- Secret Key for JWT ---
const secret_code = 'mysecret@555';

// --- MongoDB Connection ---
async function connectDB() {
  try {
    await mongoose.connect('mongodb://127.0.0.1:27017/userAuth');
    console.log("Connected to MongoDB");
  } catch (err) {
    console.error("MongoDB connection error:", err);
  }
}
connectDB();

// --- User Model ---
const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true },
    password: { type: String, required: true }
  },
  { versionKey: false }
);

const User = mongoose.model('User', userSchema, 'users');

// --- SIGNUP ROUTE ---
app.post('/signup', async (req, res) => {
  try {
    const { name, password } = req.body;
    const existingUser = await User.findOne({ name: { $regex: new RegExp(`^${name}$`, 'i') } });

    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    await User.create({ name, password: hashedPassword });

    res.status(201).json({ message: "User created successfully" });
  } catch (err) {
    console.error(err);
    res.status(400).json({ message: "Error creating user" });
  }
});

// --- LOGIN ROUTE ---
app.post('/login', async (req, res) => {
  try {
    const { name, password } = req.body;
    const user = await User.findOne({ name: { $regex: new RegExp(`^${name}$`, 'i') } });

    if (!user) {
      return res.status(401).json({ message: "Invalid username or password" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid username or password" });
    }

    const token = jwt.sign({ name: user.name }, secret_code, { expiresIn: '1h' });
    res.status(200).json({ message: "Login successful", token });
  } catch (err) {
    console.error(err);
    res.status(400).json({ message: "Error during login" });
  }
});

// --- VERIFY TOKEN ROUTE ---
app.get('/verify', async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ message: "Access denied. No token provided." });
    }

    const decoded = jwt.verify(token, secret_code);
    res.status(200).json({ valid: true, name: decoded.name });
  } catch (err) {
    console.error(err);
    res.status(401).json({ message: "Invalid or expired token" });
  }
});

// --- Get All Users (Optional) ---
app.get('/users', async (req, res) => {
  try {
    const users = await User.find({}, { password: 0 }); // Hide passwords
    res.status(200).json(users);
  } catch (err) {
    console.error(err);
    res.status(400).json({ message: "Error fetching users" });
  }
});

// --- Start Server ---
app.listen(4000, () => {
  console.log(" Server running on port 4000");
});
