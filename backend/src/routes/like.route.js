import { Router } from "express";
import { getCommentLikes, getLikedComments, getLikedVideos, getVideoLikes, toggleCommentLike, toggleTweetLike, toggleVideoLike } from "../controllers/likes.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();



router.route("/count/:videoId").get(getVideoLikes);
router.route("/comments/:commentId").get(getCommentLikes);

router.route("/toggle/c/:commentId").post(verifyJWT , toggleCommentLike);
router.route("/toggle/v/:videoId").post(verifyJWT , toggleVideoLike);
router.route("/toggle/t/:tweetId").post(verifyJWT , toggleTweetLike);
router.route("/videos").get(verifyJWT , getLikedVideos);
router.route("/comments").get(verifyJWT , getLikedComments);



export default router;