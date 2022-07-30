require("dotenv").config();
const config = Object.freeze({
  SECRET: process.env.ACCESS_TOKEN_SECRET,
  SECRET_REFRESH: "SECRET_REFRESH_ANONYSTICK",

  refreshTokenLife: 60 * 60,
});

module.exports = config;
