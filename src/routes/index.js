import {Router} from "express";
const router = Router();

router.get("/", (req, res) =>{
	res.render("index", { title: "Mailpy API" });
});

export default router;
