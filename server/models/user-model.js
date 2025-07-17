const {Schema, model} = require('mongoose');

const UserSchema = new Schema({
    email: {type: String, unique: true, required: true},
    password: {type: String}, // теперь не обязательный
    isActivated: {type: Boolean, default: false},
    activationLink: {type: String},
    resetPasswordToken: {type: String},
    resetPasswordExpires: {type: Date},
    twoFactorEnabled: {type: Boolean, default: false},
    login2FAToken: {type: String},
    login2FAExpires: {type: Date},
    // Google OAuth
    googleId: {type: String, unique: true, sparse: true},
    displayName: {type: String},
    avatar: {type: String},
})

module.exports = model('User', UserSchema);