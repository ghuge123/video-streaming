import { Router } from "express";
import { addComment, deleteComment, getVideoComments, updateComment } from "../controllers/comments.controller";
import { verifyJWT } from "../middlewares/auth.middleware";

const router = Router();


router.route("/:videoId")
.get(getVideoComments)
.post(verifyJWT ,  addComment);

router.route("/:commentId")
.patch(verifyJWT , updateComment)
.delete(verifyJWT , deleteComment);

export default router;