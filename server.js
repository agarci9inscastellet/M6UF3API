import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import mongoose from 'mongoose';
import { MongoClient } from 'mongodb';

//require('dotenv').config();
//const express = require('express');
//const mongoose = require('mongoose');
//const { MongoClient } = require('mongodb');

const app = express();
const port = process.env.PORT || 3021;
// Middleware per parsejar el cos de les sol·licituds a JSON
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Connecta't a MongoDB (modifica l'URI amb la teva pròpia cadena de connexió)
//const uri = "mongodb+srv://agarci9:xxxx@cluster0.gc1mk.mongodb.net/albums?appName=Cluster0";
const uri = process.env.MONGO_URI;
console.log("URI: ", uri);

  const client = new MongoClient(uri);
  
  try {
    await client.connect();
    const database = client.db('albums');
    const collection = database.collection('users');
    
    // Insert
    await collection.insertOne({ name: 'John', age: 30 });
    
    // Find
    const users = await collection.find({ age: { $gt: 25 } }).toArray();
    
    // Update
    await collection.updateOne(
      { name: 'John' },
      { $set: { age: 31 } }
    );
  } finally {
    await client.close();
  }






const clientOptions = {
  serverApi: { version: '1', strict: true, deprecationErrors: true },
  maxPoolSize: 10, // Limit connections
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 45000,
};

mongoose.connect(uri, clientOptions)
  .then(() => console.log('Connected to MongoDB: albums'))
  .catch(err => console.log('Error connecting to MongoDB:', err));



// Definició del model de dades (un exemple simple d'un model de "Usuari")
const albumsSchema = new mongoose.Schema({
  "$jsonSchema": {
    "bsonType": "object",
    "required": [
      "_id",
      "artist",
      "date",
      "title"
    ],
    "properties": {
      "_id": {
        "bsonType": "objectId"
      },
      "artist": {
        "bsonType": "string"
      },
      "date": {
        "bsonType": "date"
      },
      "title": {
        "bsonType": "string"
      }
    }
  }
});

const Albums = mongoose.model('albums', albumsSchema, 'albums');


/******************************************************** */
/******************************************************** */
/******************************************************** */
/******************************************************** */
/******************************************************** */
/**
 * END POINTS
 */

// Ruta a l'arrel
app.get('/:dat', (req, res) => {
    const {dat } = req.params;

  res.send('Yout API is running right now! --> '+  dat);
  
});

// Ruta per obtenir albums entre dates
app.get('/filterdates/:dataini/:datafi', async (req, res) => {
    try {
      const { dataini, datafi } = req.params;
      console.log("ENTRE DATES: ",dataini, datafi);
      const albums = await Albums.find({
        date: { $gte: dataini, $lte: datafi }
      });
  
      if (albums.length === 0) {
        return res.status(404).json({ message: 'No album found in this date range' });
      }
  
      res.status(200).json(albums);
    } catch (err) {
      res.status(500).json({ message: 'Error fetching album', error: err.message });
    }
});

// Ruta per obtenir tots els usuaris
app.get('/albums', async (req, res) => {
  try {
    const albums = await Albums.find();
    res.status(200).json(albums);
    console.log("working");
  } catch (err) {
    res.status(500).json({ message: 'Error fetching albums', error: err.message });
  }
});


app.post('/provapost/', (req, res) => {
    const { artist, title, date } = req.body;
    console.log("UPDATING ALBUM: ",req.body, artist);
    res.json({ 
        message: 'User created',
        data: req.body 
    });
});

app.delete('/albums/', async (req, res) => {
  try{
    const { artist, title, date } = req.body;
    const result = await Albums.deleteOne({ title: req.body.title });

    console.log("DELETING ALBUM: ",req.body);
    res.json({ 
      message: 'User DELETED',
      data: req.body 
    });
  }catch (err) {
      res.status(500).json({ message: 'Error fetching albums', error: err.message });

  }

});

/******************************************************** */
/******************************************************** */
/******************************************************** */
/******************************************************** */
/******************************************************** */
// changed
// Inicia el servidor
app.listen(port,  '0.0.0.0', () => {
  console.log(`Server is running on http://localhost:${port}`);
});
