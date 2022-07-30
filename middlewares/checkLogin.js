//Kiểm tra đăng nhập (Authencation)
const jwt = require("jsonwebtoken");
const User = require("../models/User");
module.exports =  (req, res, next) => {
    const authorizationHeaders = req.headers['authorization'];
    const token = authorizationHeaders.split(' ')[1];
    if(!token) res.status(401).json("You need to login");
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, async (err,data) => {
        if(err){
            res.status(401).json("You need to login");
        }
        else{
            req.data = await User.findById(data._id)
            next();
        }   
    })
}
