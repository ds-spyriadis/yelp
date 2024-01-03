const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const passportlocalMongoose = require('passport-local-mongoose');

const UserSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true
    }
})

UserSchema.plugin(passportlocalMongoose);   // vazei mono tou sthn vash to username kai to password

module.exports = mongoose.model('User', UserSchema);