const express = require('express');
const app = express();
const mongoose = require('mongoose');
const cors = require('cors');

// Middlewares
app.use(cors()); // Allow requests from your frontend
app.use(express.json()); // Enable express to parse JSON bodies

// MongoDB Connection
mongoose.connect('mongodb+srv://jwang7041:7041Nestings%25@cluster0.cmuuf0a.mongodb.net/SavedLocations');


const CitySchema = new mongoose.Schema({
    name: { type: String, required: true },
    userId: { type: String, required: true },
});

CitySchema.index({ name: 1, userId: 1 }, { unique: true });

const City = mongoose.model('Cities', CitySchema);

app.get('/cities/:userId', async (req, res) => {
    try {
        const cities = await City.find({ userId: req.params.userId });
        res.json(cities);
    } catch (err) {
        console.error(err);
        res.status(500).send(err);
    }
});

app.post('/cities', async (req, res) => {
  try {
    const { name, userId } = req.body;
    if (!name || !userId) {
      return res.status(400).json({ error: 'City name and userId are required.' });
    }

    const newCity = new City({ name, userId });
    const savedCity = await newCity.save();
    res.json(savedCity);
  } catch (err) {
    if (err.code === 11000) {
      return res.status(400).json({ error: 'This city has already been saved.' });
    }
    res.status(500).json({ error: err.message });
  }
});

// To delete a specific city, it's best to identify it by its unique ID.
// We also need to ensure the user owns this city before deleting.
// The userId will be passed in the request body for verification.
app.delete('/cities/:cityId', async (req, res) => {
  try {
    const { cityId } = req.params;
    const { userId } = req.body; // Assuming userId is sent in the body for ownership check.

    if (!userId) {
      return res.status(400).json({ error: 'userId is required to verify ownership.' });
    }

    // Find the city by its ID and the user who owns it, then delete it.
    // This ensures a user can only delete their own saved cities.
    const result = await City.findOneAndDelete({ _id: cityId, userId: userId });

    if (!result) {
      return res.status(404).json({ error: 'City not found or user not authorized to delete.' });
    }

    res.status(204).send(); // 204 No Content is a standard success response for DELETE.
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

app.listen(3000, function () {
    console.log('Server is running on port 3000!');
});
