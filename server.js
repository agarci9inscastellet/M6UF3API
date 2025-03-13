const express = require('express');
const mongoose = require('mongoose');
const app = express();
const port = process.env.PORT || 3031;
// Middleware per parsejar el cos de les sol·licituds a JSON
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


// Connecta't a MongoDB (modifica l'URI amb la teva pròpia cadena de connexió)
mongoose.connect('mongodb+srv://agarci9:Castellet25@cluster0.gc1mk.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.log('Error connecting to MongoDB:', err));

// Definició del model de dades (un exemple simple d'un model de "Usuari")
const albumsSchema = new mongoose.Schema({
  artist: String,
  title: String,
  date: String
});

const Albums = mongoose.model('albums', albumsSchema);
app.get('/', (req, res) => {
  res.send('Hello World 22222!');
});

app.post('/albums', async (req, res) => {
  /// res.status(200).json(req.body);
  // Check if request body is empty and fill with default values
  if (!req.body.name || !req.body.email) {
    req.body.name = req.body.name || "err";
    req.body.email = req.body.email || "err";
  }

  try {
    const user = new User({ name: req.body.name, email: req.body.email });
    await user.save();
    res.status(201).json(user);
  } catch (err) {
    res.status(400).json({ message: 'Error creating user', error: err.message });
  }
});

// Ruta per obtenir tots els usuaris
app.get('/albums', async (req, res) => {
  try {
    const albums = await Albums.find();
    res.status(200).json(albums);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching albums', error: err.message });
  }
});

// Ruta per obtenir un usuari per ID
app.get('/users/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching user', error: err.message });
  }
});

// Ruta per actualitzar un usuari per ID
app.put('/users/:id', async (req, res) => {
  const { id } = req.params;
  const { name, email } = req.body;
  try {
    const user = await User.findByIdAndUpdate(id, { name, email }, { new: true });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json(user);
  } catch (err) {
    res.status(400).json({ message: 'Error updating user', error: err.message });
  }
});

// Ruta per eliminar un usuari per ID
app.delete('/users/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const user = await User.findByIdAndDelete(id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json({ message: 'User deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting user', error: err.message });
  }
});

// changed
// Inicia el servidor
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
