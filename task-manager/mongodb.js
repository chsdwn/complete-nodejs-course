// CRUD

const { MongoClient, ObjectID } = require('mongodb');

const connectionURL = 'mongodb://127.0.0.1:27017';
const databaseName = 'task-manager';

const id = new ObjectID();
console.log(id);
console.log(id.getTimestamp());

MongoClient.connect(
  connectionURL,
  { useNewUrlParser: true },
  (error, client) => {
    if (error) return console.error('Unable to connect to database');

    const db = client.db(databaseName);

    db.collection('tasks').insertMany(
      [
        {
          description: 'Clean the house',
          completed: true,
        },
        {
          description: 'Renew inspection',
          completed: false,
        },
        {
          description: 'Pot plants',
          completed: false,
        },
      ],
      (error, result) => {
        if (error) return console.error('Unable to insert tasks');

        console.log(result.ops);
      },
    );
  },
);
