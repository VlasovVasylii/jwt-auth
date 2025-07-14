const {Schema, model} = require('mongoose');

const UserSchema = new Schema({
    email: {type: String, unique: true, required: true},
    password: {type: String, required: true},
    isActivated: {type: Boolean, default: false},
    activationLink: {type: String},
    resetPasswordToken: {type: String},
    resetPasswordExpires: {type: Date},
})

module.exports = model('User', UserSchema);