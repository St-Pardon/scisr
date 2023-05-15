import { Strategy as GoogleStrategy } from 'passport-google-oauth2';
import passport from 'passport';
import User from '../models/user.model';
import { config } from '../config/passport.config';

passport.use(
  new GoogleStrategy(
    config,
    async (accessToken, refreshToken, profile, done) => {
      // Handle the user authentication and save the user to the database
      try {
        // Check if the user already exists in the database
        const existingUser = await User.findOne({ email: profile.email });

        if (existingUser) {
          // User already exists, call the done() callback
          done(null, profile);
        } else {
          // Create a new user and save it to the database
          const newUser = new User({
            provider_id: profile.id,
            email: profile.email,
            password: profile.email,
            provider: profile.provider,
            first_name: profile.given_name,
            last_name: profile.family_name,
            photo: profile.picture,
          });

          const savedUser = await newUser.save();
          done(null, savedUser);
        }
      } catch (error) {
          done(error, null);
      }
    }
  )
);

passport.serializeUser((user, done) => {
  if (user) done(null, user);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});
