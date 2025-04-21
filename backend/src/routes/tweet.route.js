import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware";
import { createTweet, deleteTweet, getUserTweets, updateTweet } from "../controllers/tweets.controller";

const router = Router();

router.use(verifyJWT);

router.route("/")
.post(createTweet)
.get(getUserTweets);

router.route("/:tweetId")
.patch(updateTweet)
.delete(deleteTweet)

export default router;