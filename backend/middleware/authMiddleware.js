const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
  const token = req.header("Authorization");

  if (!token) {
    return res.status(401).send("Access Denied");
  }

  try {
    const verified = jwt.verify(
      token,
      "mysecretkey"
    );

    req.user = verified;

    next();
  } catch (error) {
    res.status(400).send("Invalid Token");
  }
};

module.exports = authMiddleware;