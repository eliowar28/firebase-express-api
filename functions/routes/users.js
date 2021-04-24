const router = require("express").Router();
const axios = require("axios");
require("dotenv").config();
const api_key = process.env.GARZON_NOTE_GOOGLE_API_KEY;

router.route("/signup").post(async (req, res) => {
  try {
    let signup = await axios.post(
      `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${api_key}`,
      {
        email: req.body.email,
        password: req.body.password,
        returnSecureToken: true,
      }
    );
    res.status(201).send(signup.data);
  } catch (error) {
    res
      .status(error.response.data.error.code)
      .send(error.response.data.error.message);
  }
});

router.route("/signin").post(async (req, res) => {
  try {
    let signin = await axios.post(
      `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${api_key}`,
      {
        email: req.body.email,
        password: req.body.password,
        returnSecureToken: true,
      }
    );

    res.status(201).send(signin.data);
  } catch (error) {
    res
      .status(error.response.data.error.code)
      .send(error.response.data.error.message);
  }
});

module.exports = router;
