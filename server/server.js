const express = require('express');
const app = express();
const mongoose = require('mongoose');
const cors = require('cors');

// Middlewares
app.use(cors()); // Allow requests from your frontend
app.use(express.json()); // Enable express to parse JSON bodies

// MongoDB Connection
mongoose.connect('mongodb+srv://jwang7041:7041Nestings%25@cluster0.cmuuf0a.mongodb.net/SavedLocations');

const ProjectSchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true},
});

const City = mongoose.model('Cities', ProjectSchema);


app.get('/cities', async (req, res) => {
    try {
        const cities = await City.find({});
        res.json(cities);
    } catch (err) {
        console.error(err);
        res.status(500).send(err);
    }
});

app.post('/cities', async (req, res) => {
  try {
    const newCity = new City({ name: req.body.name });
    const savedCity = await newCity.save();
    res.json(savedCity);
  } catch (err) {
    if (err.code === 11000) {
      return res.status(400).json({ error: 'City already saved' });
    }
    res.status(500).json({ error: err.message });
  }
});

app.listen(3000, function () {
    console.log('Server is running on port 3000!');
});
