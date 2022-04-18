const jwt = require("jsonwebtoken");
module.exports = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    // if (token === '') return;
    const decodedToken = jwt.verify(
      token,
      "natoyatoanatoyatobnatoyatoynatoyatoz"
    );
    req.userData = {
      email: decodedToken.email,
      userId: decodedToken.userId,
    };
    next();
  } catch (error) {
    console.log(error);
    res.status(401).json({
      message: "Auth Failed",
    });
  }
};
