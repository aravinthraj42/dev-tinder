const adminAuth =(req, res, next)=>{
const token = "xyzẓ";
console.log('Request received at /admin Authorization');
const isAdminAuthoziartion = token === "xyzẓ";
if(isAdminAuthoziartion){
    next();
}else{
    res.status(401).send('Unauthorized');
}

}

const userAuth =(req, res, next)=>{
const token = "abcẓ";
console.log('Request received at /user Authorization');
const isUserAuthoziartion = token === "abcẓ";
if(isUserAuthoziartion){
    next();
}else{
    res.status(401).send('Unauthorized');
}

}

module.exports = {
    adminAuth,
    userAuth
};