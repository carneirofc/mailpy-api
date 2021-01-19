import {Router} from "express";
import { Logger } from "mongodb";
const router = Router();

router.get("/", (req, res) =>{
	res.render("index", { title: "Mailpy API" });
});

export default router;
