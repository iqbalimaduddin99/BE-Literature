const joi = require("joi");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { user } = require("../../models");

exports.register = async (req, res) => {
  try {
    const { email, password } = req.body;

    const schema = joi
      .object({
        fullName: joi.string().required(),
        email: joi.string().email().required(),
        password: joi.string().min(8).required(),
        gender: joi.string().allow("").optional(),
        phone: joi.string().allow("").optional(),
        address: joi.string().allow("").optional(),
      })
      .validate(req.body);

    if (schema.error) {
      return res.status(400).send({
        status: "failed",
        message: schema.error.details[0].message,
      });
    }

    const checkEmail = await user.findOne({
      where: {
        email,
      },
    });

    if (checkEmail) {
      return res.status(400).send({
        status: "Failed",
        message: "Email Already Registered",
      });
    }

    const hashPassword = await bcrypt.hash(password, 10);

    const createUser = await user.create({
      ...req.body,
      password: hashPassword,
    });

    const token = jwt.sign(
      {
        id: createUser.id,
      },
      process.env.secretKey
    );

    const responseData = {
      email: createUser.email,
      token,
    };

    res.status(200).send({
      status: "success",
      user: responseData,
      message: "Registered Succesfully",
    });
  } catch (error) {
    console.log(error);

    res.status({
      status: "failed",
      message: "Server Error",
    });
  }
};
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const schema = joi.object({
      email: joi.string().email().required(),
      password: joi.string().min(8).required(),
    });

    const { error } = schema.validate(req.body);

    if (error) {
      return res.status(400).send({
        status: "failed",
        message: error.details[0].message,
      });
    }

    const findUser = await user.findOne({
      where: {
        email,
      },
    });

    if (!findUser) {
      return res.status(400).send({
        status: "failed",
        message: "Email or password wrong",
      });
    }

    const hashPassword = await bcrypt.compare(password, findUser.password);

    if (!hashPassword) {
      return res.status(400).send({
        status: "failed",
        message: "Email or password wrong",
      });
    }

    const token = jwt.sign(
      {
        id: findUser.id,
      },
      process.env.secretKey
    );

    const checkData = await user.findOne({
      where: {
        email,
      },
      attributes: {
        exclude: ["createdAt", "updatedAt", "password"],
      },
    });


    res.status(200).send({
      status: "success",

      user: checkData,
      token: token,
    });
  } catch (error) {
    console.log(error);

    res.status({
      status: "failed",
      message: "Server Error",
    });
  }
};
exports.getUserByIdUser = async (req, res) => {
  try {
    const { id } = req.idUser;

    const getUser = await user.findOne({
      where: { id: id },
      attributes: { exclude: ["createdAt", "updatedAt", "password"] },
    });

    if (!getUser) {
      return res.status(400).send({
        status: "failed",
        message: `Account with id ${id} not found`,
      });
    }

    res.status(200).send({
      status: "success",
      user: getUser,
    });
  } catch (error) {
    console.log(error);

    res.status({
      status: "failed",
      message: "Server Error",
    });
  }
};
exports.getUserById = async (req, res) => {
  try {
    const { id } = req.params;

    const getUser = await user.findOne({
      where: { id: id },
      attributes: { exclude: ["createdAt", "updatedAt", "password"] },
    });

    if (!getUser) {
      return res.status(400).send({
        status: "failed",
        message: `Account with id ${id} not found`,
      });
    }

    res.status(200).send({
      status: "success",
      user: getUser,
    });
  } catch (error) {
    console.log(error);

    res.status({
      status: "failed",
      message: "Server Error",
    });
  }
};
exports.editUser = async (req, res) => {
  try {
    const { id } = req.idUser;
    const { password } = req.body;
    let image = null;

    const schema = joi
      .object({
        fullName: joi.allow("").optional(),
        email: joi.string().allow("").optional(),
        password: joi.string().allow("").optional(),
        gender: joi.string().allow("").optional(),
        phone: joi.string().allow("").optional(),
        address: joi.string().allow("").optional(),
        image: joi.string().allow("").optional(),
      })
      .validate(req.body);

    if (schema.error) {
      return res.status(400).send({
        status: "failed",
        message: schema.error.details[0].message,
      });
    }

    const getUser = await user.findOne({
      where: {
        id,
      },
    });

    if (!getUser) {
      return res.status(400).send({
        status: "failed",
        message: `Account with id ${id} not found`,
      });
    }

    if (!image && !req.files) {
      const returnImage = await user.findOne({
        where: {
          id: getUser.id,
        },
      });
      image = returnImage.image;
    } else if (req.files.image) {
      image = req.files.image[0].filename;
    } else if (!image) {
      const returnImage = await user.findOne({
        where: {
          id: getUser.id,
        },
      });
      image = returnImage.image;
    }

    const newData = {
      ...req.body,
      image,
    };

    const dataUpdate = [];
    if (password !== undefined) {
      const hashPassword = await bcrypt.hash(password, 10);
      dataUpdate.push({
        ...req.body,
        password: hashPassword,
        image,
      });
      await user.update(...dataUpdate, {
        where: {
          id: getUser.id,
        },
      });
    }

    if (password === undefined) {
      await user.update(newData, {
        where: {
          id: getUser.id,
        },
      });
    }

    const findUser = await user.findOne({
      where: {
        id: getUser.id,
      },
      attributes: {
        exclude: ["createdAt", "updatedAt", "password"],
      },
    });

    res.status(200).send({
      status: "success",
      user: findUser,
    });
  } catch (error) {
    console.log(error);

    res.status({
      status: "failed",
      message: "Server Error",
    });
  }
};
exports.deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    const getUser = await user.findOne({
      where: {
        id,
      },
    });

    if (!getUser) {
      return res.status(400).send({
        status: "failed",
        message: `User with id ${id} not found`,
      });
    }

    await user.destroy({
      where: {
        id,
      },
    });

    res.status(200).send({
      status: "success",
      id: getUser.id,
      message: `user with email ${getUser.email} has deleted`,
    });
  } catch (error) {
    console.log(error);

    res.status({
      status: "failed",
      message: "Server Error",
    });
  }
};
