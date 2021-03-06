var express = require('express');
var router = express.Router();
var passportGoogle = require('../auth/google');
var User = require('../models/user');


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/login', function(req, res, next) {
  res.send('Go back and register!');
});

router.get('/auth/google', passportGoogle.authenticate('google', {scope: 'email'}));

router.get('/auth/google/callback',
  passportGoogle.authenticate('google', { failureRedirect: '/login' }),
  function(req, res) {
    // Successful authentication
    res.render('loggedIn', { infos : req.user})
  });

  router.get('/logout', function(req, res){
    req.logout();
    res.redirect('/');
  });

  router.post('/addTask', function(req, res) {
    var searchQuery = {
      email: req.user.email
    };
    var updates = {
      $addToSet: {toDo : req.body.task}
    }
    var options = {
      new: true, 
      upsert: true
    };
    User.findOneAndUpdate(searchQuery, updates, options, function(err, user) {
      if(err) {
        return console.log(err);
      } else {
          console.log('Updated', user)
          res.render('loggedIn', { infos : user})
      }
    });

  })


  // Nodemailer 

  const nodemailer = require('nodemailer');
  
  // Generate test SMTP service account from ethereal.email
  // Only needed if you don't have a real mail account for testing
  nodemailer.createTestAccount((err, account) => {
      // create reusable transporter object using the default SMTP transport
      let transporter = nodemailer.createTransport({
          host: 'smtp.ethereal.email',
          port: 587,
          secure: false, // true for 465, false for other ports
          auth: {
              user: account.user, // generated ethereal user
              pass: account.pass // generated ethereal password
          }
      });
  
      // setup email data with unicode symbols
      let mailOptions = {
          from: '"Fred Foo 👻" <foo@example.com>', // sender address
          to: 'bar@example.com, baz@example.com', // list of receivers
          subject: 'Hello ✔', // Subject line
          text: 'Hello world?', // plain text body
          html: '<b>Hello world?</b>' // html body
      };
  
      // send mail with defined transport object
      transporter.sendMail(mailOptions, (error, info) => {
          if (error) {
              return console.log(error);
          }
          console.log('Message sent: %s', info.messageId);
          // Preview only available when sending through an Ethereal account
          console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
  
          // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>
          // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
      });
  });

module.exports = router;
