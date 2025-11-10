const express = require('express');
const app = express();
const mysql = require('mysql2');
const mongoose = require('mongoose');
const { MongoError } = require('mongodb');

mongoose.connect('mongodb+srv://jwang7041:7041Nestings%25@cluster0.cmuuf0a.mongodb.net/SavedLocations');

const ProjectSchema = new mongoose.Schema({
    name: { type: String, required: true },
});

const ProjectModel = mongoose.model('Project', ProjectSchema);

app.use(cors());

app.get('/names', async (req, res) => {
    try {
        const projects = await ProjectModel.find({});
        res.json(projects);
    } catch (err) {
        console.error(err);
        res.status(500).send(err);
    }
});

app.listen(3000, function () {
    console.log('Server is running on port 3000!');
    verifyMySQLConnection();
});

