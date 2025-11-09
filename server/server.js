const express = require('express');
const app = express();
const mysql = require('mysql2');
const mongoose = require('mongoose');
const { MongoError } = require('mongodb');

mongoose.connect('mongodb://localhost:27017/companyDB');

const ProjectSchema = new mongoose.Schema({
    name: { type: String, required: true },
    budget: { type: Number, required: true }
});

const ProjectModel = mongoose.model('Project', ProjectSchema);