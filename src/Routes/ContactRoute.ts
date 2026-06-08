import express from "express";
import { createContact, getAllContacts, getContactById } from "../Controller/ContactController";
import { authenticateToken } from "../Middlewares/authenticateToken";

const router = express.Router();

router.post(
    "/",
    createContact
);


router.get(
    "/",
    authenticateToken,
    getAllContacts
);

router.get(
    "/:id",
    authenticateToken,
    getContactById
);

export {
    router as contactRouter,
};