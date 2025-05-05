import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { addWatchHistory, getWatchHistory } from "../controllers/watchHistory.controller.js";

const router = Router();

router.use(verifyJWT);

router.route('/')
.post(addWatchHistory)
.get(getWatchHistory);

export default router;