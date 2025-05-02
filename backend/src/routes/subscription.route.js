import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { getSubscribedChannels, getUserChannelSubscribers, toggleSubscription } from "../controllers/subscriber.controller.js";

const router = Router();

router.route("/:channelId")
.put(verifyJWT , toggleSubscription)
.get(getUserChannelSubscribers)


router.route("/:subscriberId").get(getSubscribedChannels);


export default router;