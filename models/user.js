const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    username: {type: String, required: true},
    password: {type: String, required: true},
    deckId: {type: Number, required: true}    // TODO: This may be a string... not sure how foreign keys work in MongoDB just yet
});

const User = mongoose.model("User", UserSchema);

module.exports = User;