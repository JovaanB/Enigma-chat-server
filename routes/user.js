const express = require("express");
const User = require("../models/User");
const router = express.Router();

router.get("/users", async (req, res) => {
    const users = await User.find();
    res.send(users);
});

router.get("/login", async (req, res) => {
    const { name } = req.query;
    const users = await User.find({ firstname: name });
    res.send(users?.length > 0);
});

router.post("/users", async (req, res) => {
    const user = new User({
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        email: req.body.email,
        phone: req.body.phone,
    });
    await user.save();
    res.send(user);
});

module.exports = router;
