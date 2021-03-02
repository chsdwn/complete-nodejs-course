const express = require('express');
const auth = require('../middleware/auth');
const multer = require('multer');
const User = require('../models/user');
const router = new express.Router();

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

const upload = multer({
  dest: 'avatars',
  limits: { fileSize: 1024 * 1024 * 1 },
  fileFilter(req, file, callback) {
    if (!file.originalname.match(/\.(jpg|jpeg|png)$/))
      return callback(new Error('Please upload an image'));

    callback(undefined, true);
  },
});
router.post(
  '/users/me/avatar',
  upload.single('avatar'),
  (req, res) => {
    res.send();
  },
  (error, req, res, next) => {
    res.status(400).send({ error: error.message });
  },
);

router.patch('/users/me', auth, async (req, res) => {
  const bodyKeys = Object.keys(req.body);
  const allowedUpdates = ['name', 'email', 'password', 'age'];
  const isValidOperation = bodyKeys.every((bodyKey) =>
    allowedUpdates.includes(bodyKey),
  );

  if (!isValidOperation)
    return res.status(400).send({ error: 'Invalid updates' });

  try {
    bodyKeys.forEach((bodyKey) => (req.user[bodyKey] = req.body[bodyKey]));
    await req.user.save();

    res.send(req.user);
  } catch (e) {
    res.status(400).send(e);
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

router.post('/users/logoutAll', auth, async (req, res) => {
  try {
    req.user.tokens = [];
    await req.user.save();
    res.send();
  } catch {
    res.status(500).send();
  }
});

router.post('/users/logout', auth, async (req, res) => {
  try {
    req.user.tokens = req.user.tokens.filter(
      ({ token }) => token !== req.token,
    );
    await req.user.save();

    res.send();
  } catch {
    res.status(500).send();
  }
});

router.delete('/users/me', auth, async (req, res) => {
  try {
    await req.user.remove();
    res.send(req.user);
  } catch {
    res.status(500).send();
  }
});

module.exports = router;
