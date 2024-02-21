const router = require('express').Router();
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { registerValidation, loginValidation } = require('../validation');

// REGISTER
router.post("/register", async (req, res) => {

    //Register Validation
    const { error } = registerValidation(req.body)
    if (error) return res.status(400).send(error.details[0].message);

    //Checking if the user is already in the database

    const emailExit = await User.findOne({ email: req.body.email })
    if (emailExit) return res.status(400).send('Email is already exists!')

    //Hash Password

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt)

    const user = User({
        name: req.body.name,
        email: req.body.email,
        password: hashedPassword
    });

    try {
        const savedUser = await user.save();
        res.send(savedUser)
    } catch (error) {
        res.status(400).send(error)
    }
});

//LOGIN
router.post("/login", async (req, res) => {
    //Login Validation
    const { error } = loginValidation(req.body)
    if (error) return res.status(400).send(error.details[0].message);

    //Checking if the user exists or not in the database

    const user = await User.findOne({ email: req.body.email })
    if (!user) return res.status(400).send('Email is not registered!')

    //Checking password is correct
    const validatePass = await bcrypt.compare(req.body.password, user.password);
    if (!validatePass) return res.status(400).send('Invalid Password')

    // Create and assign token

    const token = jwt.sign({ _id: user._id }, process.env.TOKEN_SECRET)
    res.header('auth-token', token).send(token)

    res.send('Logged in!')

})



module.exports = router;