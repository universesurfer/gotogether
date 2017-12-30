const express = require("express");
let router = express.Router();
let jwt = require('jsonwebtoken');
let jwtOptions = require('../config/jwtoptions');
let cors = require('cors');

const User = require('../models/user');
const mongoose = require('mongoose');

const bcrypt = require('bcrypt');
const bcryptSalt = 10;



//SIGNUP POST
router.post('/signup', (req, res, next) => {
  var email = req.body.email;
  var password = req.body.password;

  if (!email || !password) {
    res.status(400).json({message: "Both email and password are required"});
    return;
  }

  User.findOne({ email }, "email", (err, user) => {
    if (user !== null) {
      res.status(400).json({ message: 'Email exists already' });
      return;
    }

    var salt = bcrypt.genSaltSync(bcryptSalt);
    var hashPass = bcrypt.hashSync(password, salt);

    var newUser = User({
      email,
      password: hashPass
    });

    newUser.save((err, user) => {
      if (err) {
        res.status(400).json({ message: err });
      } else {
        var payload = {id: user._id};
        console.log('user', user);
        var token = jwt.sign(payload, jwtOptions.secretOrKey);
        res.status(200).json({ message: 'ok', token: token});
      }
    });

  });
});


module.exports = router;