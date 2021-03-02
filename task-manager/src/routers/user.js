const express = require('express');
const auth = require('../middleware/auth');
const router = new express.Router();

const User = require('../models/user');

router.get('/users/me', auth, async (req, res) => {
  console.log('user', req.user);
  res.send(req.user);
});

router.get('/users/:id', async (req, res) => {
  const _id = req.params.id;

  try {
    const user = await User.findById(_id);
    if (!user) return res.status(400).send();
    res.send(user);
  } catch {
    res.status(500).send();
  }
});

router.get('/users', auth, async (_, res) => {
  try {
    const users = await User.find({});
    res.send(users);
  } catch {
    res.status(500).send();
  }
});

router.post('/users', async (req, res) => {
  const user = new User(req.body);

  try {
    await user.save();
    const token = await user.generateAuthToken();
    res.status(201).send({ user, token });
  } catch (e) {
    res.status(400).send(e);
  }
});

router.patch('/users/:id', async (req, res) => {
  const bodyKeys = Object.keys(req.body);
  const allowedUpdates = ['name', 'email', 'password', 'age'];
  const isValidOperation = bodyKeys.every((bodyKey) =>
    allowedUpdates.includes(bodyKey),
  );

  if (!isValidOperation)
    return res.status(400).send({ error: 'Invalid updates' });

  try {
    const user = await User.findById(req.params.id);
    bodyKeys.forEach((bodyKey) => (user[bodyKey] = req.body[bodyKey]));
    await user.save();

    if (!user) return res.status(404).send();
    res.send(user);
  } catch (e) {
    res.status(400).send(e);
  }
});

router.delete('/users/:id', async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).send();
    res.send(user);
  } catch {
    res.status(500).send();
  }
});

router.post('/users/login', async (req, res) => {
  try {
    const user = await User.findByCredentials(
      req.body.email,
      req.body.password,
    );
    const token = await user.generateAuthToken();
    res.send({ user, token });
  } catch {
    res.status(400).send();
  }
});

module.exports = router;
