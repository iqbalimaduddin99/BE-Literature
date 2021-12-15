const { user, literature, bookmark } = require("../../models");

exports.addBookmark = async (req, res) => {
  try {
    const { id } = req.idUser;
    const idParams = req.body.literatureId;

    const BookmarkCheck = await bookmark.findOne({
      where: {
        literatureId: idParams,
        userId: id,
      },
      include: [
        {
          model: user,
          as: "user",
          attributes: {
            exclude: ["createdAt", "updatedAt", "password"],
          },
        },
        {
          model: literature,
          as: "literature",
          attributes: {
            exclude: ["createdAt", "updatedAt"],
          },
        },
      ],
    });
    if (BookmarkCheck) {
      await bookmark.destroy({
        where: {
          literatureId: idParams,
          userId: id,
        },
      });
      return res.status(200).send({
        status: "success remove",
        message: "remove bookmark succesful",
        bookmark: BookmarkCheck,
      });
    }

    const dataUpload = {
      ...req.body,
      userId: id,
    };
    const bookmarkCreate = await bookmark.create(dataUpload);

    const findBookmark = await bookmark.findOne({
      where: {
        id: bookmarkCreate.id,
      },
      include: [
        {
          model: user,
          as: "user",
          attributes: {
            exclude: ["createdAt", "updatedAt", "password"],
          },
        },
        {
          model: literature,
          as: "literature",
          attributes: {
            exclude: ["createdAt", "updatedAt"],
          },
        },
      ],
    });
    res.status(200).send({
      status: "success add",
      message: "add bookmark succesful",
      bookmark: findBookmark,
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).send({
      status: "failed",
      message: "server error",
    });
  }
};
exports.getBookmark = async (req, res) => {
  try {
    const { id } = req.idUser;
    const paramsId = req.params.id;
    console.log(paramsId);
    const findPosts = await bookmark.findOne({
      where: {
        literatureId: paramsId,
        userId: id,
      },
    });

    console.log(findPosts);
    if (findPosts === null) {
      res.send({
        status: "failed",
        message: "no bookmark found",
      });
    }
    res.send({
      status: "success",
      message: "bookmark found",
      data: findPosts,
    });
  } catch (error) {
    console.log(error.message);
    res.send({
      status: "failed",
      message: "server error",
    });
  }
};
exports.getBookmarks = async (req, res) => {
  try {
    const { id } = req.idUser;
    const findPosts = await bookmark.findAll({
      where: {
        userId: id,
      },
      include: {
        model: literature,
        as: "literature",
      },
    });
    console.log(findPosts);
    if (findPosts.length === 0) {
      res.send({
        status: "failed",
        message: "no bookmark found",
      });
    }
    res.send({
      status: "success",
      message: "bookmark found",
      data: findPosts,
    });
  } catch (error) {
    console.log(error.message);
    res.send({
      status: "failed",
      message: "server error",
    });
  }
};
