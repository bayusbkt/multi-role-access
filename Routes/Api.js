import express from "express";
import {
  createUser,
  getUser,
  updateUser,
  deleteUser,
  login,
  logout,
  checkSession,
} from "../Controllers/UserController.js";
import { adminOnly, verifyUser } from "../Middleware/AuthUser.js";
import {
  createProduct,
  deleteProduct,
  getProductById,
  getProducts,
  updateProduct,
} from "../Controllers/ProductController.js";

const router = express.Router();

//User Auth
router.post("/login", login);
router.delete("/logout", logout);
router.get("/session", checkSession);

//User CRUD
router.post("/user", verifyUser, adminOnly, createUser);
router.get("/user/:uuid?", verifyUser, adminOnly, getUser);
router.put("/user/:uuid", verifyUser, adminOnly, updateUser);
router.delete("/user/:uuid", verifyUser, adminOnly, deleteUser);

//Product
router.get("/products", verifyUser, getProducts);
router.get("/product/:productId", verifyUser, getProductById);
router.post("/product", verifyUser, createProduct);
router.put("/product/:productId", verifyUser, updateProduct);
router.delete("/product/:productId", verifyUser, deleteProduct);

export default router;
