const validator = require('validator');

const validateUser = (req) => {
    const {firstName, lastName, email, password, age, gender, phoneNumber} = req.body;

    if(!firstName || firstName.length < 2) {
        throw new Error('First name is required and should be at least 2 characters long');
    }
    if(!lastName || lastName.length < 2) {
        throw new Error('Last name is required and should be at least 2 characters long');
    }
    if(!email || !validator.isEmail(email)) {
        throw new Error('A valid email is required');
    }
    if(!password || !validator.isStrongPassword(password)) {
        throw new Error('A valid password is required and should be strong');
    }
    if(!age || age < 18) {
        throw new Error('Age is required and should be at least 18');
    }
    if(!gender || !['Male', 'Female', 'Other'].includes(gender)) {
        throw new Error('A valid gender is required');
    }
    if(!phoneNumber || phoneNumber.toString().length < 10) {
        throw new Error('A valid phone number is required and should be at least 10 digits long');
    }
}

module.exports = validateUser;