const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const cors = require('cors');

const app = express();
const PORT = 3000;
const FILE_PATH = './data.json';

app.use(cors());
app.use(bodyParser.json());

// Save data to file
app.post('/save', (req, res) => {
  const data = req.body;
  fs.writeFile(FILE_PATH, JSON.stringify(data), (err) => {
    if (err) {
      console.error(err);
      return res.status(500).send({ message: 'Error saving data' });
    }
    res.send({ message: 'Data saved successfully!' });
  });
});

// Load data from file
app.get('/load', (req, res) => {
  fs.readFile(FILE_PATH, 'utf8', (err, data) => {
    if (err) {
      console.error(err);
      return res.status(500).send({ message: 'Error loading data' });
    }
    res.send(JSON.parse(data || '{}'));
  });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
