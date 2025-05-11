const GoogleStrategy = require("passport-google-oauth20").Strategy;

function passportConfig(passport) {
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: `${process.env.BACKEND_URL}/api/auth/google/callback`,
      },
      (accessToken, refreshToken, profile, done) => {
        done(null, profile); // Here you can save to DB if needed
      }
    )
  );

  passport.serializeUser((user, done) => {
    done(null, user);
  });

  passport.deserializeUser((obj, done) => {
    done(null, obj);
  });
}

module.exports = passportConfig;
