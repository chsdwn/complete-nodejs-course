const mongoose = require('mongoose');

mongoose.connect('mongodb://127.0.0.1:27017/task-manager-api', {
  useNewUrlParser: true,
  useCreateIndex: true,
});

const User = mongoose.model('User', {
  name: {
    type: String,
  },
  age: {
    type: Number,
  },
});

const ali = new User({ name: 'Ali', age: 24 });
ali
  .save()
  .then(() => {
    console.log(ali);
  })
  .catch((error) => {
    console.error(error);
  });