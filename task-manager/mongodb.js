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
      .updateOne(
        {
          _id: new ObjectID('603b5893e6aea91cd00721d7'),
        },
        {
          $inc: { age: -1 },
          // $set: { name: 'Hüseyin' },
        },
      )
      .then((result) => {
        console.log(result.result);
      })
      .catch(console.error);

    db.collection('tasks')
      .updateMany({ completed: false }, { $set: { completed: true } })
      .then((result) => console.log(result.result))
      .catch(console.error);
  },
);
