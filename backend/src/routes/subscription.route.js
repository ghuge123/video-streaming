import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { getSubscribedChannels, getUserChannelSubscribers, toggleSubscription } from "../controllers/subscriber.controller.js";

const router = Router();

router.use(verifyJWT);

router.route("/:channelId")
.get(getUserChannelSubscribers)
.patch(toggleSubscription);


router.route("/:subscriberId").get(getSubscribedChannels);


export default router;