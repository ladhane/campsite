const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');

const userSchema = mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true
    }
});

//passportlocalMongoose will automatically add username and  password field to the user schema
userSchema.plugin(passportLocalMongoose);

const User = mongoose.model('User',userSchema);
module.exports = User;