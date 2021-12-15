"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class bookmark extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      bookmark.belongsTo(models.user, {
        as: "user",
        foreignKey: {
          name: "userId",
        },
      });
      bookmark.belongsTo(models.literature, {
        as: "literature",
        foreignKey: {
          name: "literatureId",
        },
      });
    }
  }
  bookmark.init(
    {
      literatureId: DataTypes.INTEGER,
      userId: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "bookmark",
    }
  );
  return bookmark;
};
