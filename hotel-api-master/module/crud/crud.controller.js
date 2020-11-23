import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { userModel } from "./crud.model";
import httpStatus from "../../utils/httpStatus";
import appConfig from "../../config/env";
import crypto from "crypto-random-string";
import nodemailer from "nodemailer";

const userController = {};

// Create User
userController.register = async (req, res, next) => {
  userModel
    .find({ email: req.body.email })
    .exec()
    .then((user) => {
      if (user.length >= 1) {
        return res.status(httpStatus.CONFLICT).json({
          message: "Mail exists",
        });
      } else {
        bcrypt.hash(req.body.password, 10, async (err, hash) => {
          console.log(hash);
          if (err) {
            return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
              error: err,
            });
          } else {
            const activation = crypto({ length: 16, type: "alphanumeric" });

              const transporter = nodemailer.createTransport({
                service: "gmail",
                auth: {
                  user: "christianmttan@gmail.com",
                  pass: appConfig.gmail_password, // naturally, replace both with your real credentials or an application-specific password
                },
                tls: {
                  rejectUnauthorized: false,
                },
              });

            // email activation to user
            const mailOptions = {
              from: "tophatada@gmail.com",
              to: req.body.email,
              subject: "Activate your account",
              text: `https://kodigo.co/activate/${activation}`,
            };

            console.log(activation);
            console.log(appConfig.gmail_password);
            console.log(req.body.email);

            transporter.sendMail(mailOptions, async function(err, info) {
              if (err) {
                console.log(err);

                res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
                  error: err,
                });
              } else {
                console.log(info);

                const newUser = await userModel.create({
                  firstName: req.body.firstName,
                  lastName: req.body.lastName,
                  address: req.body.address,
                  country: req.body.country,
                  phone: req.body.phone,
                  email: req.body.email,
                  role: req.body.role,
                  password: hash,
                  activation_key: activation,
                });

                let { password, __v, ...user } = newUser.toObject();
                return res.status(httpStatus.CREATED).json({ data: { user } });
              }
            });
          }
        });
      }
    });
};

// Login user
userController.login = async (req, res, next) => {
  userModel
    .find({ email: req.body.email })
    .exec()
    .then((user) => {
      if (user.length < 1) {
        return res.status(httpStatus.UNAUTHORIZED).json({
          message: "Auth failed",
        });
      }

      if (!user[0].is_active) {
        return res.status(httpStatus.UNAUTHORIZED).json({
          message: "Not yet activated",
        });
      }

      bcrypt.compare(req.body.password, user[0].password, (err, result) => {
        if (err) {
          return res.status(httpStatus.UNAUTHORIZED).json({
            message: "Auth failed",
          });
        }
        if (result) {
          const token = jwt.sign(
            {
              email: user[0].email,
              userId: user[0].id,
              role: user[0].role,
            },
            appConfig.jwt_key,
            {
              expiresIn: appConfig.jwt_expiration,
            }
          );
          return res.status(httpStatus.OK).json({
            message: "Auth successful",
            token: token,
          });
        }
        res.status(httpStatus.UNAUTHORIZED).json({
          message: "Auth failed",
        });
      });
    })
    .catch((err) => {
      res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
        error: err,
      });
    });
};

userController.activate = async (req, res) => {
  console.log(req.params.activation);

  try {
    const activation = req.params.activation;

    let user = await userModel.findOneAndUpdate(
      {
        activation_key: activation,
      },
      { $set: { is_active: true } },
      (err, doc) => {
        if (err) {
          console.log("Activation Error!");
          return res
            .status(httpStatus.BAD_REQUEST)
            .json({ message: "Activation error" });
        }

        if (!doc) {
          return res
            .status(httpStatus.BAD_REQUEST)
            .json({ message: "Activation key not found" });
        }

        return res.status(httpStatus.OK).json({
          message: "Activation successful",
        });
      }
    );
  } catch (err) {
    console.log(err);
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
      error: err,
    });
  }
};

// Get All Users
userController.findAll = async (req, res) => {
  try {
    let users = await userModel.find();
    return res.json(users);
  } catch (error) {
    return res
      .status(httpStatus.INTERNAL_SERVER_ERROR)
      .json({ error: error.toString() });
  }
};

// Get User By ID
userController.findOne = async (req, res) => {
  try {
    let user = await userModel.findById(req.params.userId);
    if (!user) {
      return res
        .status(httpStatus.BAD_REQUEST)
        .json({ message: "User not found" });
    }
    return res.json(user);
  } catch (error) {
    return res
      .status(httpStatus.INTERNAL_SERVER_ERROR)
      .json({ error: error.toString() });
  }
};

// Update User By ID
userController.update = async (req, res) => {
  try {
    let user = await userModel.findById(req.params.userId);
    if (!user) {
      return res
        .status(httpStatus.BAD_REQUEST)
        .json({ message: "User not found" });
    }
    Object.assign(user, req.body);
    await user.save();
    return res.json(user);
  } catch (error) {
    return res.status(500).json({ error: error.toString() });
  }
};

// Delete User By ID
userController.delete = async (req, res) => {
  try {
    let user = await userModel.findByIdAndRemove(req.params.userId);
    if (!user) {
      return res
        .status(httpStatus.BAD_REQUEST)
        .json({ message: "User not found" });
    }
    return res.json({ message: "User deleted successfully!" });
  } catch (error) {
    return res.status(500).json({ error: error.toString() });
  }
};

export default userController;
