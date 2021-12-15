
const { user } = require("../../models");

const jwt = require("jsonwebtoken");

exports.auth = (req, res, next) => {
  try {
    let header = req.header("Authorization");

    if (!header) {
      return res.status(404).send({
        status: "failed",
        message: "Unauthorized",
      });
    }

    const token = header.replace("Bearer ", "");

    const secretKey = process.env.secretKey;

    const verified = jwt.verify(token, secretKey);

    req.idUser = verified;

    next();
  } catch (error) {
    console.log(error);
    res.status({
      status: "failed",
      message: "Server Error",
    });
  }
};

exports.adminAuth = async (req, res, next) => {
  try {
    const findAdmin = await user.findOne({
      where: {
        id: req.idUser.id,
      },
    });

    if (findAdmin.status !== "admin") {
      return res.send({
        status: "failed",
        message: "Forbidden access",
      });
    }

    next();
  } catch (error) {
    console.log(error);
    res.status({
      status: "failed",
      message: "Server Error",
    });
  }
};