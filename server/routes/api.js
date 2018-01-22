const express = require("express");
const session = require("express-session");
let router = express.Router();

const User = require('../models/user');
const Company = require('../models/company');
const Review = require('../models/review');
const mongoose = require("mongoose");
const upload = require('../config/multer');





// GET api listing
router.get('/', (req, res) => {
  res.send('api works');
});


// router.get('/profile/:id', (req, res) => {
//   console.log("Getting a user from the database");
//   if(!mongoose.Types.ObjectId.isValid(req.params.id)) {
//     return res.status(400).json({ message: 'Specified id is not valid' });
//   }
//
//   User.findById(req.params.id, (err, user) => {
//     if (err) {
//       return res.send(err);
//     } else {
//       return res.json(user);
//     }
//   });
// });


//EDIT USER PROFILE
router.put('/profile/:id', (req, res) => {

// console.log("Checking out file in route", req.file);

  if(!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return res.status(400).json({ message: 'Specified id is not valid.' });
  }

  User.findByIdAndUpdate(req.params.id, {
    aboutText: req.body.aboutText
  }, (err, user, aboutText) => {
    if (err) {
      return res.send(err);
    } else {

      res.json({
        message: "Getting the aboutText req.body " + req.body.aboutText,
        user: user,
        aboutText: aboutText
      });
    }
  });
});

// var uploadFile = upload.fields({ name: 'file', maxCount: 1 });

// NOTE: may be getting 500 error due to user in DB not yet having image property?
router.post('/profile/:id', upload.single('file'), (req, res, next) => {

    console.log("Checking out file in route", req.file);

  var id = req.params.id;

  let image = req.file;


  User.findByIdAndUpdate(id, {
    image: image
  }, (err, user, image) => {

    if (err) {
      next(err);
    } else {
      res.json({
        user: "Getting the user in image update" + user,
        file: "Here's the image file" + image
      });
    }

  });
});







router.put('/:category', (req, res) => {

  res.json({
    category: req.params,
    user: req.body
  });


});

router.get('/:category', (req, res) => {
  Company.find({ "category": req.params.category }, (err, companies) => {
    if (!companies) {
      res.status(400).json({ message: "Can't find any companies in this category or they don't exist yet." });
    } else {

      return res.json({
        message: "getting companies!",
        companies: companies,
        paramCheck: req.params.category
      });
  }
});
});

router.get('/:category/:company', (req, res) => {

  Company.findOne({ "companyName": req.params.company}, (err, company) => {
    if(!company) {
      res.status(400).json({ message: "Can't find the company you're looking for at the moment." });
    } else {

      return res.json({
        message: "Retrieving your company",
        company: company
      });

    }

  });
});


router.post('/:category/:company', (req, res) => {

  var subject = req.body.subject;
  var commentBody = req.body.commentBody;
  var starRating = req.body.starRating;
  var userId = req.body.userId;

  if(!subject || !commentBody || !starRating) {
    res.status(400).json({ message: "Subject, comment body, and star rating are required." });
    return;
  }

  var newReview = Review({
    starRating,
    subject,
    commentBody,
    userId
  });

  newReview.save((err, review) => {
       if (err) {
         return res.status(400).json({ message: err });
       } else {
         // res.json({
         //   message: "Inside the response for the review post to company",
         //   params: req.params,
         //   requestBody: req.body
         // });

         res.status(200).json({ message: 'Review saved', review });
       }
     });
});


//
// router.post('/signup', (req, res, next) => {
//   var email = req.body.email;
//   var password = req.body.password;
//
//   if (!email || !password) {
//     res.status(400).json({message: "Both email and password are required"});
//     return;
//   }
//
//   User.findOne({ email }, "email", (err, user) => {
//     if (user !== null) {
//       res.status(400).json({ message: 'Email exists already' });
//       return;
//     }
//
//     var salt = bcrypt.genSaltSync(bcryptSalt);
//     var hashPass = bcrypt.hashSync(password, salt);
//
//     var newUser = User({
//       email,
//       password: hashPass
//     });
//
//     newUser.save((err, user) => {
//       if (err) {
//         res.status(400).json({ message: err });
//       } else {
//         var payload = {id: user._id};
//         console.log('user', user);
//         var token = jwt.sign(payload, jwtOptions.secretOrKey);
//
//         res.status(200).json({ message: 'ok', token: token});
//       }
//     });
//
//   });
// });
//
//







module.exports = router;
