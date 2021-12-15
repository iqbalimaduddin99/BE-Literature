const { user } = require("../../models");

exports.checkAuth = async (req, res) => {
  try {
    const { id } = req.idUser;

    const checkEmail = await user.findOne({
      where: {
        id,
      },
      attributes: {
        exclude: ["createdAt", "updatedAt", "password"],
      },
    });

    if (!checkEmail) {
      return res.status(400).send({
        status: "Failed",
        message: "Unauthorized",
      });
    }

    res.status(200).send({
      status: "success",
      user: checkEmail,
      message: "Authorized",
    });
  } catch (error) {
    console.log(error);

    res.status({
      status: "failed",
      message: "Server Error",
    });
  }
};
