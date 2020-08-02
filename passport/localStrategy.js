const bcrypt = require('bcryptjs')
const User = require('../models/user')
const LocalStrategy = require('passport-local').Strategy

const strategy = new LocalStrategy(
	{
		usernameField: 'username' // not necessary, DEFAULT
	},
	function(username, password, done) {
		User.findOne({ username: username }, (err, user) => {
			if (err) {
				return done(err)
			}
			if (!user) {
				return done(null, false, { message: 'Incorrect username' })
			}
			bcrypt.compare(password, user.password, (err, isMatch) => {
				if (err) throw err;
				if (isMatch) {
					console.log(user);
					return done(null, user);
				} else {
					return done(null, false, { message: 'Password incorrect' });
				}
			});
			return done(null, user)
		})
	}
)

module.exports = strategy
