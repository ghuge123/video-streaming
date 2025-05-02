import { Router } from "express";
import { deleteVideo, getAllVideos, getVideoById, publishAVideo, togglePublishStatus, updateVideo } from "../controllers/video.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { upload } from "../utils/cloudinary.js";

const router = Router();
// router.use(verifyJWT); //  it apply verifyJWT middleware to all routes

router.route("/" )
.get(getAllVideos)
.post(verifyJWT , upload.fields([
    {
        name: "videoFile",
        maxCount: 1
    },
    {
        name: "thumbnail",
        maxCount: 1
    }
]) , publishAVideo);

router.route("/:videoId")
.get(verifyJWT , getVideoById)
.patch(verifyJWT , upload.single("thumbnail"), updateVideo)
.delete(verifyJWT , deleteVideo)

router.route("/toggle/public/:videoId").patch(verifyJWT , togglePublishStatus);

export default router;
