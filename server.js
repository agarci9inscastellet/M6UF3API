require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const app = express();
const port = process.env.PORT || 3022;
// Middleware per parsejar el cos de les sol·licituds a JSON
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// Connecta't a MongoDB (modifica l'URI amb la teva pròpia cadena de connexió)

//const uri = "mongodb+srv://agarci9:xxxx@cluster0.gc1mk.mongodb.net/albums?appName=Cluster0";
const uri = process.env.MONGO_URI;
console.log("URI: ", uri);

//const clientOptions = { serverApi: { version: '1', strict: true, deprecationErrors: true },  useNewUrlParser: true, useUnifiedTopology: true };
const clientOptions = { };

mongoose.connect(uri, clientOptions)
  .then(() => console.log('Connected to MongoDB: albums'))
  .catch(err => console.log('Error connecting to MongoDB:', err));

// Definició del model de dades (un exemple simple d'un model de "Usuari")
const albumsSchema = new mongoose.Schema({
  title: { type: String, required: true },
  artist: { type: String, required: true },
  date: { type: String, required: true }
},{ versionKey: false });

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
app.get('/', (req, res) => {

  res.send('Yout API is running - ARA!');
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

app.post('/add_album', async (req, res) => {
  try {
    const { artist, title, date } = req.body;
    console.log("CREATING ALBUM...: ",req.body, title, artist, date);
    // Create a new album document
    const album = new Albums({ title, artist, date });

    // Save to MongoDB
    const savedAlbum = await album.save();

    res.status(201).json({ message: 'Album added successfully', album: savedAlbum });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error adding album', error });
  }
});



app.delete('/delete_album/', async (req, res) => {
  try{
    const { _id } = req.body;
    const result = await Albums.deleteOne({ _id: req.body._id });

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
