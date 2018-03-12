var passport = require('passport');
var GoogleStrategy = require('passport-google-oauth20').Strategy;

var User = require('../models/user');
var config = require('../_config');
var init = require('./init');

passport.use(new GoogleStrategy({
    clientID: config.google.clientID,
    clientSecret: config.google.clientSecret,
    callbackURL: config.google.callbackURL
  },
  // Google sends back the tokens and progile info
  function(token, tokenSecret, profile, done) {

    var searchQuery = {
      email: profile.emails[0].value
    };

    var updates = {
      name: profile.displayName,
      email: profile.emails[0].value,
      photo: profile.photos[0].value, 
      someID: profile.id
    };

    var options = {
      new: true, 
      upsert: true
    };

    // update the user if s/he exists or add a new user
    User.findOneAndUpdate(searchQuery, updates, options, function(err, user) {
      if(err) {
        return done(err);
      } else {
            return done(null, user);
      }
    });

  }

));

// serialize user into the session
init();


module.exports = passport;