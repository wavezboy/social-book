import express from "express";
import * as userController from "../controller/userController";
import { requestAuth } from "../middleware/auth";

const router = express.Router();

router.get("/", requestAuth, userController.getAuthenticatedUser);

router.post("/signup", userController.signUp);
router.post("/login", userController.login);
router.post("/logout", userController.logOut);
export default router;
