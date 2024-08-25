const express = require('express');
const bodyParser = require('body-parser');
const { MongoClient, ObjectID } = require('mongodb');

const app = express();
const port = 3000;

// MongoDB connection URL
const url = 'mongodb://localhost:27017';
const dbName = 'crudApp';

// Middleware to parse JSON
app.use(bodyParser.json());


// Root path
app.get('/', (req, res) => {
    res.send('Welcome to the CRUD App!');
  });

// CRUD operations

// Create
app.post('/api/items', async (req, res) => {
  try {
    const client = await MongoClient.connect(url, { useNewUrlParser: true });
    const db = client.db(dbName);
    const collection = db.collection('items');
    const result = await collection.insertOne(req.body);
    res.send(result.ops[0]);
    client.close();
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});

// Read
app.get('/api/items', async (req, res) => {
  try {
    const client = await MongoClient.connect(url, { useNewUrlParser: true });
    const db = client.db(dbName);
    const collection = db.collection('items');
    const items = await collection.find().toArray();
    res.send(items);
    client.close();
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});

// Update
app.put('/api/items/:id', async (req, res) => {
  try {
    const client = await MongoClient.connect(url, { useNewUrlParser: true });
    const db = client.db(dbName);
    const collection = db.collection('items');
    const result = await collection.findOneAndUpdate(
      { _id: new ObjectID(req.params.id) },
      { $set: req.body },
      { returnOriginal: false }
    );
    res.send(result.value);
    client.close();
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});

// Delete
app.delete('/api/items/:id', async (req, res) => {
  try {
    const client = await MongoClient.connect(url, { useNewUrlParser: true });
    const db = client.db(dbName);
    const collection = db.collection('items');
    const result = await collection.findOneAndDelete({ _id: new ObjectID(req.params.id) });
    res.send(result.value);
    client.close();
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});

// Retrieve IDs
app.get('/api/items/ids', async (req, res) => {
    try {
      const client = await MongoClient.connect(url, { useNewUrlParser: true });
      const db = client.db(dbName);
      const collection = db.collection('items');
      const items = await collection.find().project({ _id: 1 }).toArray();
      const ids = items.map(item => item._id);
      res.send(ids);
      client.close();
    } catch (error) {
      console.error(error);
      res.status(500).send('Internal Server Error');
    }
  });

  // Root path
app.get('/', (req, res) => {
    res.send('Welcome to the CRUD App!');
  });
  

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
