import { Strategy as GoogleStrategy } from 'passport-google-oauth2';
import passport from 'passport';
import User from '../models/user.model';
import { config } from '../config/passport.config';
import { Strategy as localStrategy } from 'passport-local';
import {
  ExtractJwt as ExtractJWT,
  Strategy as JWTstrategy,
} from 'passport-jwt';

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
          done(null, existingUser);
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

passport
  .use(
    new JWTstrategy(
      {
        secretOrKey: process.env.JWT_SECRET,
        jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
        ignoreExpiration: false,
        jsonWebTokenOptions: {
          maxAge: '48h',
        },
      },
      async (token, done) => {
        try {
          return done(null, token.user);
        } catch (error) {
          return done(error);
        }
      }
    )
  )

  .use(
    'signup',
    new localStrategy(
      {
        usernameField: 'email',
        passwordField: 'password',
        passReqToCallback: true,
      },
      async (req, email, password, done) => {
        try {
          const data = req.body;
          const { username } = req.body;
          // checks if user's username or email already exist
          const checkUsername = await User.findOne({ username });
          const checkMail = await User.findOne({ email });

          if (checkUsername) {
            return done(null, false, { message: 'Username already exist' });
          }

          if (checkMail) {
            return done(null, false, { message: 'Email already exist' });
          }

          const user = await User.create({ ...data, email, password });
          
          return done(null, user);
        } catch (error) {
          console.log('some err');
          return done(error);
        }
      }
    )
  )

  .use(
    'signin',
    new localStrategy(
      {
        usernameField: 'email',
        passwordField: 'password',
      },
      async (email, password, done) => {
        try {
          const user = await User.findOne({ email: email })

          if (!user) {
            return done(null, false, { message: 'User not found' });
          }

          const validate = await user.isValidPassword(password);

          if (!validate) {
            return done(null, false, { message: 'Wrong Password' });
          }

          return done(null, user, { message: 'Logged in Successfully' });
        } catch (error) {
          return done(error);
        }
      }
    )
  );