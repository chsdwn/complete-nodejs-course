// CRUD

const { MongoClient, ObjectID } = require('mongodb');

const connectionURL = 'mongodb://127.0.0.1:27017';
const databaseName = 'task-manager';

MongoClient.connect(
  connectionURL,
  { useUnifiedTopology: true },
  (error, client) => {
    if (error) return console.error('Unable to connect to database');

    const db = client.db(databaseName);
    db.collection('users')
      .deleteMany({ age: 27 })
      .then((result) => console.log(result.result))
      .catch(console.error);

    db.collection('users')
      .deleteOne({ age: 24 })
      .then((result) => console.log(result.result))
      .catch(console.error);
  },
);
