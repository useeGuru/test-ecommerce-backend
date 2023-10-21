const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');

const User = require('../models/User');

module.exports.register = (req, res, next) => {
  const errors = validationResult(req);
  if(!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  const firstname = req.body.firstname;
  const lastname = req.body.lastname;
  const username = req.body.username;
  const email = req.body.email;
  const password = req.body.password;
  bcrypt.hash(password, 12)
    .then(hashedPassword => {
      const user = new User({
        firstname,
        lastname,
        username,
        email,
        password: hashedPassword,
      });
      return user.save();
    })
    .then(user => {
      res.status(201).json({
        message: 'User is registered successfully.',
        user
      });
    })
    .catch(error => {
      console.log(error);
      res.status(500).json(error);
    });
};

module.exports.login = (req, res, next) => {
  const username = req.body.username;
  const password = req.body.password;
  let user;
  User.findOne({ username })
    .then(foundUser => {
      if(!foundUser) {
        return res.status(400).json({
          message: 'Username is not valid!'
        });
      }
      user = foundUser;
      return bcrypt.compare(password, user.password);
    })
    .then(isEqual => {
      if(typeof isEqual === 'boolean') {
        if(!isEqual) {
          return res.status(400).json({
            message: 'Password is not correct!'
          });
        }
        // Generate the JWT
        const token = jwt.sign(
          {
            id: user._id.toString(),
            username: user.username
          },
          process.env.JWT_SECRET_KEY,
          {
            expiresIn: '1d'
          }
        );
        res.status(200).json({
          message: 'User is logined successfully.',
          token,
          userId: user._id.toString(),
          username: user.username
        });
      }

    })
    .catch(error => {
      res.status(500).json(error);
    });
};