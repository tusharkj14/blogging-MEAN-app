const express = require("express");
const { appendFile } = require("fs");
const user = require("../models/user.js");
const crypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const router = express.Router();

router.post("/signup", (req, res, next) => {
  crypt.hash(req.body.password, 10).then((hash) => {
    const newUser = new user({
      username: req.body.username,
      email: req.body.email,
      password: hash,
    });
    newUser
      .save()
      .then((result) => {
        res.status(201).json({
          message: "User  Created",
          result: result,
        });
      })
      .catch((err) => {
        res.status(500).json({
          error: err,
        });
      });
  });
});

router.post("/signin", (req, res, next) => {
  let staticUser;
  user
    .findOne({ email: req.body.email })
    .then((givenUser) => {
      if (!givenUser) {
        return res.status(401).json({
          message: "Auth Failed",
        });
      }
      // console.log(givenUser[0].password);
      staticUser = givenUser;
      const ans = crypt.compareSync(req.body.password, givenUser.password);
      return ans;
    })
    .then((result) => {
      // console.log(result);
      if (!result) {
        return res.status(401).json({
          message: "Auth Failed.",
        });
      }
      const token = jwt.sign(
        { email: staticUser.email, userId: staticUser._id },
        "natoyatoanatoyatobnatoyatoynatoyatoz",
        {
          expiresIn: "24h",
        }
      );
      res.status(200).json({
        message: "Succesfully Signed in",
        token: token,
        expiration: 86400,
        userId: staticUser._id,
      });
    })
    .catch((error) => {
      console.log(error);
      return res.status(401).json({
        message: "Auth Failed.",
      });
    });
});

module.exports = router;
