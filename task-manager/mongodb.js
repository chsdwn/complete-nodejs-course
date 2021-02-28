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
    db.collection('users').findOne({ _id: new ObjectID('') }, (error, user) => {
      if (error) return console.error('Unable to fetch');

      console.log(user);
    });

    db.collection('users')
      .find({ age: 25 })
      .toArray((error, users) => {
        console.log(users);
      });

    db.collection('users')
      .find({ name: 'Ali' })
      .count((error, count) => {
        console.log(count);
      });
  },
);
