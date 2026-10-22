const jwt = require('jsonwebtoken');
const User = require('../model/user');

const userAuth = async (req, res, next) =>{

    const {token} = req.cookies;
    if(!token){
        return res.status(401).send('Unauthorized, Please Login');
    }

    const decodedObj = jwt.verify(token, "DEV@Tinder@790");

    const {_id } = decodedObj;

    const user = await User.findById(_id);
    if(!user){
        return res.status(401).send('Unauthorized');
    }
    req.user = user;
    next();

}

module.exports = userAuth;