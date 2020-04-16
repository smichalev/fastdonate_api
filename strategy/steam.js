const path = require('path');
const passport = require('passport');
const SteamStrategy = require('passport-steam').Strategy;

const config = require(path.join(__dirname, '..', 'config'));

passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(obj, done) {
  done(null, obj);
});

passport.use(new SteamStrategy({
    returnURL: `http://${ config.domain }/api/auth/steam/return`,
    realm: `http://${ config.domain }/`,
    apiKey: `${ config.authorization.steamApiKey }`
  },
  (identifier, profile, done) => {
    process.nextTick(() => {
      profile.identifier = identifier;
      return done(null, profile);
    });
  }
));
