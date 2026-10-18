const mongoose = require('mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
        minlength: 2
    },
    lastName: { 
        type: String,
        minlength: 2
    },
    email: {
        type: String,
        required: true,
        unique: true,
        index: true,
        lowercase: true,
        trim:true,
        minlength: 5,
        validate: (value) => {
            if(!validator.isEmail(value)) {
                throw new Error(`${value} is not a valid email`);
            }
        }
    },
    password: {
        type: String,
        required: true,
        minlength: 8,
            validate: (value) => {
            if(!validator.isStrongPassword(value)) {
                throw new Error(`${value} is not a valid password`);
            }
        },
    },  
    age:{
        type: Number,
        min:18

    },
    gender:{
        type: String,
        enum: {
            values: ['Male', 'Female', 'Other'],
            message: '{VALUE} is not a valid gender'
        },
        // validate: {
        //     validator: function(v) {
        //         return ['Male', 'Female', 'Other'].includes(v);
        //     },
        //     message: props => `${props.value} is not a valid gender`
        // }
        // validate:(value) => {
        //     if(!['Male', 'Female', 'Other'].includes(value)){
        //         throw new Error(`${value} is not a valid gender`);
        //     }
        // }
    },

    phoneNumber:{
        type: Number,
        minlength: 10
    },
    about:{
        type: String,
        default:"This about the User"
    },
    skill:{
        type: [String],
    },
    profileUrl:{
        type: String,
        default: "https://www.flaticon.com/free-icon/profile_3135715.png",
          validate: (value) => {
            if(!validator.isURL(value)) {
                throw new Error(`${value} is not a valid URL`);
            }
        }
    },
}, {
    timestamps: true
});

// const User = mongoose.model('User', userSchema);

userSchema.methods.getJWT = function() {
    const user = this;
    const token = jwt.sign({_id: user._id}, 'DEV@Tinder@790', { expiresIn: '1d' });
    return token;
};

userSchema.methods.validatePassword = async function(passwordInputByUser) {
    const user = this;
    const passwordHash = user.password;
    const isPasswordValid = await bcrypt.compare(passwordInputByUser, passwordHash);
    
    if(!isPasswordValid) {
        throw new Error(`Invalid password`);
    }

    return isPasswordValid;
};


module.exports = mongoose.model('User', userSchema);