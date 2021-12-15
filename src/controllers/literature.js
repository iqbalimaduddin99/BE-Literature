const { user, literature } = require("../../models");

exports.postLiterature = async (req, res) => {
  try {
    const { id } = req.idUser;

    let documentFile = null;
    if (req.files.documentFile) {
      documentFile = req.files.documentFile[0].filename;
    }

    const dataUpload = {
      ...req.body,
      attache: documentFile,
      userId: id,
    };

    const createLiterature = await literature.create(dataUpload);

    const checkLiterature = await literature.findOne({
      where: {
        id: createLiterature.id,
      },
      include: {
        model: user,
        as: "user",
        attributes: {
          exclude: ["createdAt", "updatedAt", "password"],
        },
      },
      attributes: {
        exclude: ["createdAt", "updatedAt", "userId"],
      },
    });

    res.send({
      status: "success",
      literature: checkLiterature,
    });
  } catch (error) {
    console.log(error);

    res.status({
      status: "failed",
      message: "Server Error",
    });
  }
};
exports.getLiterature = async (req, res) => {
  try {
    let getLiterature = await literature.findAll({
      attributes: { exclude: ["createdAt", "updatedAt"] },
      include: {
        model: user,
        as: "user",
        attributes: {
          exclude: ["createdAt", "updatedAt", "password"],
        },
      },
    });
    const path = "http://localhost:5000/uploads/document/";
    getLiterature = JSON.parse(JSON.stringify(getLiterature));
    const takeData = getLiterature.map((item) => {
      return { ...item, attache: path + item?.attache };
    });
    res.status(200).send({
      status: "success",
      literature: takeData,
    });
  } catch (error) {
    console.log(error);

    res.status({
      status: "failed",
      message: "Server Error",
    });
  }
};
exports.getLiteratureThatApprove = async (req, res) => {
  try {
    let getLiterature = await literature.findAll({
      where: {
        action: "approve",
      },
      attributes: { exclude: ["createdAt", "updatedAt"] },
      include: {
        model: user,
        as: "user",
        attributes: {
          exclude: ["createdAt", "updatedAt", "password"],
        },
      },
    });

    const path = "http://localhost:5000/uploads/document/";
    getLiterature = JSON.parse(JSON.stringify(getLiterature));
    const takeData = getLiterature.map((item) => {
      return { ...item, attache: path + item?.attache };
    });
    res.status(200).send({
      status: "success",
      literature: takeData,
    });
  } catch (error) {
    console.log(error);

    res.status({
      status: "failed",
      message: "Server Error",
    });
  }
};
exports.getLiteraturebyId = async (req, res) => {
  try {
    const { id } = req.params;

    let getLiterature = await literature.findOne({
      where: {
        id,
      },
      attributes: { exclude: ["createdAt, updatedAt"] },
      include: {
        model: user,
        as: "user",
        attributes: {
          exclude: ["createdAt", "updatedAt", "password"],
        },
      },
    });
    const path = "http://localhost:5000/uploads/document/";

    getLiterature = JSON.parse(JSON.stringify(getLiterature));

    const newData = {
      ...getLiterature,
      attache: path + getLiterature?.attache,
    };
    res.status(200).send({
      status: "success",
      literature: newData,
    });
  } catch (error) {
    console.log(error);

    res.status({
      status: "failed",
      message: "Server Error",
    });
  }
};
exports.getLiteraturebyCreated = async (req, res) => {
  try {
    const { id } = req.idUser;

    let getLiterature = await literature.findAll({
      where: {
        userId: id,
      },
      attributes: { exclude: ["createdAt, updatedAt"] },
      include: {
        model: user,
        as: "user",
        attributes: {
          exclude: ["createdAt", "updatedAt", "password"],
        },
      },
    });

    if (!getLiterature) {
      res.status(400).send({
        status: "failed",
        message: `Literature with userId ${id} not found`,
      });
    }
    const path = "http://localhost:5000/uploads/";

    let attachment = JSON.parse(JSON.stringify(getLiterature));

    res.send({
      status: "success",
      data: getLiterature,
      attachment: attachment.map((x) => path + x.attach),
    });
  } catch (error) {
    console.log(error);

    res.status({
      status: "failed",
      message: "Server Error",
    });
  }
};
exports.getLiteraturebyIdUser = async (req, res) => {
  try {
    const { id } = req.params;

    let getLiterature = await literature.findAll({
      where: {
        userId: id,
      },
      attributes: { exclude: ["createdAt, updatedAt"] },
      include: {
        model: user,
        as: "user",
        attributes: {
          exclude: ["createdAt", "updatedAt", "password"],
        },
      },
    });
    if (!getLiterature) {
      res.status(400).send({
        status: "failed",
        message: `Literature with userId ${id} not found`,
      });
    }
    const path = "http://localhost:5000/uploads/";

    let attachment = JSON.parse(JSON.stringify(getLiterature));

    res.send({
      status: "success",
      data: getLiterature,
      attachment: attachment.map((x) => path + x.attachment),
    });
  } catch (error) {
    console.log(error);

    res.status({
      status: "failed",
      message: "Server Error",
    });
  }
};
exports.editLiterature = async (req, res) => {
  try {
    const { id } = req.params;
    const data = req.body;
    let image = null;

    const getLiterature = await literature.findOne({
      where: {
        id,
      },
    });

    if (!getLiterature) {
      return res.send({
        status: "failed",
        message: "Literature not created yet",
      });
    }

    if (!image && !req.files) {
      const returnImage = await literature.findOne({
        where: {
          id: getLiterature.id,
        },
      });
      image = returnImage.image;
    } else if (req.files.image !== undefined) {
      image = req.files.image[0].filename;
    }

    const dataUpload = {
      ...data,
      attache: image,
    };
    await literature.update(dataUpload, {
      where: {
        id,
      },
    });
    const findLiterature = await literature.findOne({
      where: {
        id: getLiterature.id,
      },
      attributes: {
        exclude: ["createAt", "updateAt", "password"],
      },
      include: [
        {
          model: user,
          as: "user",
          attributes: {
            exclude: ["createdAt", "updatedAt"],
          },
        },
      ],
    });

    res.send({
      status: "success",
      data: findLiterature,
    });
  } catch (error) {
    console.log(error);

    res.status({
      status: "failed",
      message: "Server Error",
    });
  }
};
exports.deleteLiterature = async (req, res) => {
  try {
    const { id } = req.params;

    const getLiterature = await literature.findOne({
      where: {
        id,
      },
    });

    if (!getLiterature) {
      return res.status(400).send({
        status: "failed",
        message: `Literature with id ${id} not created`,
      });
    }

    await literature.destroy({
      where: {
        id,
      },
    });

    res.status(200).send({
      status: "success",
      id: getLiterature.id,
      message: `Literature with id ${getLiterature.id} has deleted`,
    });
  } catch (error) {
    console.log(error);

    res.status({
      status: "failed",
      message: "Server Error",
    });
  }
};

// const path = "http://localhost:5000/uploads/document";

// let attachment = JSON.parse(JSON.stringify(getLiterature));

// const responseData = {
//   ...getLiterature,
//   attach: attachment.map((x) => path + x.attachment),
// };
