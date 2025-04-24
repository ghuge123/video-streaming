import { Router } from "express";
import { changeCurrentPassword, getUser, getUserChannel, getWatchHistory, loggOut, refreshAccessToken, updateAccountDetails, updateCoverImage, updateUserAvatar, userLogin, userRegistration } from "../controllers/user.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { userValidationRule } from '../validator/validator.js';
import { validate } from '../middlewares/userValidation.js';
import { upload } from "../utils/cloudinary.js";

const router = Router();
router.route("/register").post(upload.fields([
    {
        name : "avatar",
        maxCount : 1
    } ,
    {
        name : 'coverImage',
        maxCount : 1
    }
]) , userValidationRule() , validate  , userRegistration);

router.route("/login").post(userLogin);

router.route("/logout").post(verifyJWT , loggOut);

router.route("/refresh-token").post(refreshAccessToken);

router.route("/change-password").post(verifyJWT , changeCurrentPassword);

router.route("/current-user").get(verifyJWT , getUser);

router.route("/update-account").patch(verifyJWT , updateAccountDetails);

router.route("/update-avatar").patch( upload.single("avatar") , verifyJWT , updateUserAvatar);

router.route("/update-coverImage").patch(upload.single("coverImage"), verifyJWT  , updateCoverImage);

router.route("/channel/:username").get(verifyJWT , getUserChannel);

router.route("/watchHistory").get(verifyJWT , getWatchHistory);
export default router;