import { DataTypes } from "sequelize";
import { sequelize } from "../Config/Database.js";
import UserModel from "./UserModel.js";

const ProductModel = sequelize.define(
  "Product",
  {
    uuid: {
      type: DataTypes.STRING,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
        len: [3, 100],
      },
    },
    price: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
  },
  {
    freezeTableName: true,
  }
);

UserModel.hasMany(ProductModel, { foreignKey: "userId" });
ProductModel.belongsTo(UserModel, { foreignKey: "userId" });


export default ProductModel;
