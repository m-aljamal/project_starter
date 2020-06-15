const sgMail = require("@sendgrid/mail");
const User = require("../models/User");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const bcrypt = require("bcryptjs");
sgMail.setApiKey(process.env.SEND_GRID_API);

const createUser = async (req, res, next) => {
  const { name, email, password } = req.body;
  try {
    let user = await User.findOne({ email });
    if (user) {
      const error = {
        name: "existingUser",
        message: "user is alredy registered",
      };
      return next(error);
    }
    const token = jwt.sign(
      { name, email, password },
      process.env.JWT_ACCOUNT_ACTIVATION,
      { expiresIn: "10m" }
    );

    const msg = {
      to: email,
      from: process.env.EMAIL_FROM,
      subject: "Activate your EDC account",
      html: `
        <div style="
        border: 1px solid black;
        padding: 20px;
        text-align: center;
        ">
        <h1>👏Thank you for registration 👏</h1>
        <p>Please use the following link to activate your account</p>
        <p>${process.env.FRONTEND_URL}/auth/activate/${token}</p>
        <p>EDC 🙌🎉</p>
        </div>
        `,
    };
    try {
      await sgMail.send(msg);

      res.json({
        message: `Email has been sent to ${email}. Follow the instraction to active your account`,
      });
    } catch (error) {
      return next(error);
    }
  } catch (error) {
    return next(error);
  }
};

const activateUser = async (req, res, next) => {
  const { token } = req.body;
  if (token) {
    jwt.verify(
      token,
      process.env.JWT_ACCOUNT_ACTIVATION,
      async (error, decoded) => {
        if (error) {
          const error = {
            name: "JsonWebTokenError",
            message: "Token is not correct or time is finished",
          };
          return next(error);
        }
        const { name, email, password } = jwt.decode(token);
        let user = await User.findOne({ email });

        if (user) {
          const error = {
            name: "existingUser",
            message: "user is alredy registered",
          };
          return next(error);
        }
        try {
          user = new User({
            name,
            email,
            password,
          });
          const salt = await bcrypt.genSalt(10);
          user.password = await bcrypt.hash(password, salt);
          await user.save();
          const payload = {
            user: {
              id: user.id,
            },
          };
          jwt.sign(
            payload,
            process.env.JWT_CREATE_USER,
            { expiresIn: "7d" },
            (error, token) => {
              if (error) throw err;
              userToken = token;
              res.json({ token });
            }
          );
        } catch (error) {
          return next(error);
        }
      }
    );
  } else {
    const error = {
      name: "TokenNotFound",
      message: "Token is not found or time is finished",
    };
    return next(error);
  }
};

const getLoggedinUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    res.json(user);
  } catch (error) {
    next(error);
  }
};

const signin = async (req, res, next) => {
  const { email, password } = req.body;
  try {
    let user = await User.findOne({ email });
    if (!user) {
      const error = {
        name: "userNotFound",
        message: "No user found, please sign up",
      };
      return next(error);
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      const error = {
        name: "passwordIsWrong",
        message: "Wrong password",
      };
      return next(error);
    }
    const payload = {
      user: {
        id: user.id,
      },
    };
    jwt.sign(
      payload,
      process.env.JWT_CREATE_USER,
      { expiresIn: "7d" },
      (error, token) => {
        if (error) throw error;
        res.json({ token });
      }
    );
  } catch (error) {
    next(error);
  }
};

module.exports = {
  signin,
  getLoggedinUser,
  createUser,
  activateUser,
};
