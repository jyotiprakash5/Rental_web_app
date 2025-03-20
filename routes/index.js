var express = require('express');
var router = express.Router();
const userModel = require('./users');
const postModel = require('./post');
const passport = require('passport');
const upload = require('./multer');

const localStrategy = require('passport-local');
passport.use(new localStrategy(userModel.authenticate()));

router.get('/', function (req, res) {
  res.render('index', { title: 'Express' });
});

router.get('/feed', isLoggedIn, async function (req, res) {
  const user = await userModel.findOne({
    username: req.session.passport.user
  });
  const posts = await postModel.find()
    .populate('user');
  res.render('feed', { user, posts });
});

router.post('/upload', isLoggedIn, upload.single('file'), async function (req, res) {
  if (!req.file) {
    return res.status(404).send('No file uploaded');
  }
  const user = await userModel.findOne({
    username: req.session.passport.user
  });
  const post = await postModel.create({
    image: req.file.filename,
    imageText: req.body.filecaption,
    Price: req.body.Price,
    user: user._id
  });
  user.post.push(post._id);
  await user.save();
  res.redirect('/profile');
});

router.get('/login', function (req, res) {
  res.render('login', { error: req.flash("error") });
});

router.get('/profile', isLoggedIn, async function (req, res) {
  const user = await userModel.findOne({
    username: req.session.passport.user
  })
    .populate('post');
  res.render('profile', { user });
});

router.post('/register', function (req, res) {
  const userdata = new userModel({
    username: req.body.username,
    email: req.body.email,
    fullname: req.body.fullname,
    Phonenumber: req.body.Phonenumber
  });
  userModel.register(userdata, req.body.password)
    .then(function () {
      passport.authenticate('local')(req, res, function () {
        res.redirect('/profile');
      });
    });
});

router.post('/login', passport.authenticate('local', {
  successRedirect: '/profile',
  failureRedirect: '/login',
  failureFlash: true
}), function (req, res) {
});

router.get('/logout', function (req, res) {
  req.logout(function (err) {
    if (err) { return next(err); }
    res.redirect('/');
  });
});

// Delete Route
router.post('/delete/:id', isLoggedIn, async function (req, res) {
  const postId = req.params.id;
  try {
    // Find the post and delete it
    const post = await postModel.findByIdAndDelete(postId);
    if (post) {
      // Remove the post from the user's post array
      await userModel.updateOne(
        { _id: post.user },
        { $pull: { post: postId } }
      );
      res.redirect('/profile');
    } else {
      res.status(404).send('Post not found');
    }
  } catch (err) {
    res.status(500).send('Error deleting post');
  }
});

function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect('/login');
}

module.exports = router;

















// var express = require('express');
// var router = express.Router();
// const userModel = require('./users');
// const postModel = require('./post');
// const passport = require('passport');
// const upload=require('./multer');

// const localStrategy=require('passport-local');
// passport.use(new localStrategy(userModel.authenticate()));


// router.get('/', function (req, res) {
//   res.render('index',{title:'Express'});
// });
// router.get('/feed',isLoggedIn,async function (req, res) {
//   const user=await userModel.findOne({
//     username:req.session.passport.user
//   })
//   const posts=await postModel.find()
//   .populate('user')
//   res.render('feed',{user,posts});
// });

// router.post('/upload',isLoggedIn,upload.single('file'),async function (req, res) {
//   if(!req.file){
//    return res.status(404).send('No file uploaded');
//   }
//    const user=await userModel.findOne({
//     username:req.session.passport.user})//req.session.passport.user has username
//     const post=await postModel.create({
//       image:req.file.filename,//it has uploaded filename
//       imageText:req.body.filecaption,
//       Price:req.body.Price,
//       user:user._id
//     })
//     user.post.push(post._id);
//     await user.save();
//    res.redirect('/profile')
// });



// router.get('/login', function (req, res) {
//   // console.log(req.flash("error"));
//   res.render('login',{error:req.flash("error")});
// });
// router.get('/profile', isLoggedIn, async function (req, res) {
//   const user=await userModel.findOne({
//     username:req.session.passport.user
//   })
//   .populate('post')
//   res.render('profile',{user});//user is an object
// });
// router.post('/register', function (req, res) {

//   const userdata = new userModel({
//     username: req.body.username,
//     email: req.body.email,
//     fullname: req.body.fullname,
//     Phonenumber: req.body.Phonenumber

//   });
//   userModel.register(userdata, req.body.password)
//     .then(function () {
//       passport.authenticate('local')(req, res, function () {//
//         res.redirect('/profile')
//       })

//     })
// })
// router.post('/login', passport.authenticate('local', {
//  successRedirect: '/profile',
//  failureRedirect: '/login' ,
//  failureFlash: true 

// }), function (req, res) {
// });
// router.get('/logout', function (req, res) {
//   req.logout(function(err) {
//     if (err) { return next(err); }
//     res.redirect('/');
//   });
// });

// function isLoggedIn(req, res, next) {
//   if (req.isAuthenticated()) {
//     return next();
//   }
//   res.redirect('/login');
// } 


// module.exports = router;


