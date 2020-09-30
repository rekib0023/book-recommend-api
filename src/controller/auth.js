const User = require("../models/User")

exports.signin = (req, res) => {
  const { credentials } = req.body;

  User.findOne({ email: credentials.email }).then((user) => {
    if (user && user.authenticate(credentials.password)) {
      res.json({ user: user.toAuthJSON() });
    } else {
      res.status(400).json({ errors: { global: "Invalid credentials" } });
    }
  });
};

exports.signup = (req, res) => {
  const { email, password, username, fullname } = req.body.user;
  User.findOne({ username: username }).then((user) => {
    if (user) {
      return res
        .status(400)
        .json({ errors: { username: "Username already taken" } });
    }
    User.findOne({ email: email }).then((user) => {
      if (user) {
        return res
          .status(400)
          .json({ errors: { email: "User already exists" } });
      }
      const _user = new User({ fullname, username, email, password });
      _user.save().then((userRecord) => {
        res.json({ user: userRecord.toAuthJSON() });
      });
    });
  });
  // .catch((err) => res.status(400).json({ errors: parseErrors(err.errors) }));
};
