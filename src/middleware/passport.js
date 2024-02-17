const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const JwtStrategy = require('passport-jwt').Strategy;
const { ExtractJwt } = require('passport-jwt');
const bcrypt = require('bcrypt');

const User = require('../models/user.model');

// Passport JWT
passport.use(
	new JwtStrategy(
		{
			jwtFromRequest:
				ExtractJwt.fromAuthHeaderAsBearerToken('Authorization'),
			secretOrKey: process.env.JWT_SECRET,
		},
		async (payload, done) => {
			try {
				const phoneNumber = payload.sub;

				const user = await User.query('phoneNumber')
					.eq(phoneNumber)
					.exec();

				if (!user || user.count === 0) return done(null, false);
				done(null, user[0]);
			} catch (error) {
				done(error, false);
			}
		}
	)
);

// Passport Local
passport.use(
	new LocalStrategy(
		{
			usernameField: 'phoneNumber',
		},
		async (phoneNumber, password, done) => {
			try {
				const user = await User.query('phoneNumber')
					.eq(phoneNumber)
					.exec();

				if (!user || user.count === 0) return done(null, false);

				const hashedPassword = user[0].password;

				const isCorrectPassword = await bcrypt.compare(
					password,
					hashedPassword
				);

				if (!isCorrectPassword) {
					return done(null, false);
				}

				done(null, user[0]);
			} catch (error) {
				done(error, false);
			}
		}
	)
);
