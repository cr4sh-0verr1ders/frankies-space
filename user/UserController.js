const express = require("express");
const router = express.Router();
const bodyParser = require("body-parser");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const User = require("./User");
const config = require("../config")

// ???
router.use(bodyParser.urlencoded({extended: false}));
router.use(bodyParser.json())


/*
    Gotta check:
    - whether account exists
    - all fields are filled
*/

function verifyToken(req, res, next) {
    const token = req.headers['authorization'];
    if (!token) return res.status(401).send({auth:false, message:"No token was sent."})
    jwt.verify(token, config.secret, function(err, decoded){
        if(err) res.status(500).send({auth:false, message:"Could not authenticate token."});
        req.userId = decoded.id;
        next();
    })
}

router.post('/register', function(req, res){
    // Hash the password. Can't be unencrypted. 
    const hashedPassword = bcrypt.hashSync(req.body.password, 10);

    User.create({
        name: req.body.name,
        email: req.body.email,
        password: hashedPassword,
    },function(err,user){
        if (err) return res.status(500).send("There was a problem registering user")
        // otherwise lets create a token.
        const token = jwt.sign({id: user._id}, config.secret, {
            expiresIn: 86400
        })
        // Return an OK status
        res.status(200).send({auth: true, token: token});
    })
})

router.get('/me', verifyToken, function(req, res) {
    User.findById(req.userId, {password: 0}, function(err, user){ // req.userId gets passed from the middleware verifyToken();
        if(err) return res.status(500).send("An error occurred while finding user");
        if(!user) return res.status(404).send("No user found");

        res.status(200).send(user);
    })
})

router.post('/login', function(req, res) {
    User.findOne({ email: req.body.email }, function(err, user){
        if(err) return res.status(500).send("There was a problem logging in");
        if (!user) return res.status(404).send("No user was found.");
        const isPasswordValid = bcrypt.compareSync(req.body.password, user.password); 
        if (!isPasswordValid) return res.status(401).send({auth:"false", token:null})
        const token = jwt.sign({id: user._id}, config.secret, {
            expiresIn: 86400
        })
        res.status(200).send({auth:true, token:token});
    })
})

router.get('/logout', function(req, res){
    res.status(200).send({auth:false, token:null});
})
module.exports = router;

