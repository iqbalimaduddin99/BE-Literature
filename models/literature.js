"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class literature extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      literature.belongsTo(models.user, {
        as: "user",
        foreignKey: {
          name: "userId",
        },
      });
      literature.hasMany(models.bookmark, {
        as: "literature",
        foreignKey: {
          name: "literatureId",
        },
      });
    }
  }
  literature.init(
    {
      title: DataTypes.STRING,
      userId: DataTypes.INTEGER,
      publication_date: DataTypes.DATE,
      pages: DataTypes.INTEGER,
      ISBN: DataTypes.INTEGER,
      author: DataTypes.STRING,
      attache: DataTypes.STRING,
      action: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "literature",
    }
  );
  return literature;
};
