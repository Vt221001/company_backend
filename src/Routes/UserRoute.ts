import express from "express";
import { createUser, loginUser, logoutUser, refreshAccessTokenAdmin } from "../Controller/UserController";


const router = express.Router();

router.post("/register", createUser);

router.post("/login", loginUser);

router.post("/refresh-token", refreshAccessTokenAdmin);
router.post("/logout", logoutUser);

export { router as userRouter };