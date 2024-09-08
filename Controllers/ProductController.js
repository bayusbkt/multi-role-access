import ProductModel from "../Models/ProductModel.js";
import UserModel from "../Models/UserModel.js";
import { Op } from "sequelize";

const productAttributes = ["uuid", "name", "price"];
const userAttributes = ["uuid", "name", "email", "role"];

export const getProducts = async (req, res) => {
  try {
    let response;
    if (req.role == "Admin") {
      response = await ProductModel.findAll({
        attributes: productAttributes,
        include: [
          {
            model: UserModel,
            attributes: userAttributes,
          },
        ],
      });
    } else {
      response = await ProductModel.findAll({
        where: {
          userId: req.userId,
        },
        attributes: productAttributes,
        include: [
          {
            model: UserModel,
            attributes: userAttributes,
          },
        ],
      });
    }
    if (!response) throw { message: "Product Not Found" };
    res.status(200).json({
      status: true,
      message: "Success Get All Product",
      data: response,
    });
  } catch (error) {
    res.status(400).json({
      status: false,
      message: error.message,
    });
  }
};

export const getProductById = async (req, res) => {
  try {
    const product = await ProductModel.findOne({
      where: {
        uuid: req.params.productId,
      },
    });
    if (!product) throw { message: "Product Not Found" };

    let response;
    if (req.role == "Admin") {
      response = await ProductModel.findOne({
        where: {
          uuid: product.uuid,
        },
        attributes: productAttributes,
        include: [
          {
            model: UserModel,
            attributes: userAttributes,
          },
        ],
      });
    } else {
      response = await ProductModel.findOne({
        where: {
          [Op.and]: [{ uuid: product.uuid }, { userId: req.userId }],
        },
        attributes: productAttributes,
        include: [
          {
            model: UserModel,
            attributes: userAttributes,
          },
        ],
      });
      if (!response) throw { message: "Access Denied" };
    }

    res.status(200).json({
      status: true,
      message: "Success Get Product By ID",
      data: response,
    });
  } catch (error) {
    res.status(400).json({
      status: false,
      message: error.message,
    });
  }
};

export const createProduct = async (req, res) => {
  try {
    const { name, price } = req.body;
    if (!name) throw { message: "Please Input Product Name" };
    if (!price) throw { message: "Please Input Product Price" };

    const product = await ProductModel.create({
      name,
      price,
      userId: req.userId,
    });
    if (!product) throw { message: "Failed to Create Product" };

    res.status(201).json({
      status: true,
      message: "Success Create Product",
      data: product,
    });
  } catch (error) {
    res.status(400).json({
      status: false,
      message: error.message,
    });
  }
};

export const updateProduct = async (req, res) => {
  try {
    const product = await ProductModel.findOne({
      where: {
        uuid: req.params.productId,
      },
    });
    if (!product) throw { message: "Product Not Found" };

    const { name, price } = req.body;
    if (req.role == "Admin") {
      await ProductModel.update(
        {
          name,
          price,
        },
        {
          where: {
            uuid: product.uuid,
          },
        }
      );
    } else {
      if (req.userId !== product.userId) throw { message: "Access Denied" };
      await ProductModel.update(
        {
          name,
          price,
        },
        {
          where: {
            [Op.and]: [{ uuid: product.uuid }, { userId: req.userId }],
          },
        }
      );
    }

    res.status(200).json({
      status: true,
      message: "Success Update Product",
    });
  } catch (error) {
    res.status(400).json({
      status: false,
      message: error.message,
    });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const product = await ProductModel.findOne({
      where: {
        uuid: req.params.productId,
      },
    });
    if (!product) throw { message: "Product Not Found" };

    if (req.role == "Admin") {
      await ProductModel.destroy(
        {
          where: {
            uuid: product.uuid,
          },
        }
      );
    } else {
      if (req.userId !== product.userId) throw { message: "Access Denied" };
      await ProductModel.destroy(
        {
          where: {
            [Op.and]: [{ uuid: product.uuid }, { userId: req.userId }],
          },
        }
      );
    }

    res.status(200).json({
      status: true,
      message: "Success Delete Product",
    });
  } catch (error) {
    res.status(400).json({
      status: false,
      message: error.message,
    });
  }
};
