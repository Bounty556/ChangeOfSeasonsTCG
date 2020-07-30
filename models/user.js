const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    username: {type: String, required: true, unique: true},
    password: {type: String, required: true},
    avatar: {type: String, default: 'cyclop_01.png'},
    wins: {type: Number, default: 0},
    losses: {type: Number, default: 0},
    cardIds: [{type: Number, required: true}]                // User's deck
});

// Define schema methods
UserSchema.methods = {
	checkPassword: function (inputPassword) {
		return bcrypt.compareSync(inputPassword, this.password)
	},
	hashPassword: plainTextPassword => {
		return bcrypt.hashSync(plainTextPassword, 10)
	}
}

// Define hooks for pre-saving
UserSchema.pre('save', function (next) {
	if (!this.password) {
		console.log('models/user.js =======NO PASSWORD PROVIDED=======')
		next()
	} else {
		console.log('models/user.js hashPassword in pre save');
		
		this.password = this.hashPassword(this.password)
		next()
	}
})

const User = mongoose.model('User', UserSchema);

module.exports = User;