import mongoose from "mongoose";
import { User } from "../models/user.model.js";
import bcrypt from "bcrypt";
import jwt from 'jsonwebtoken'

const generateAccessTokenAndRefreshToken = async (id) => {
    try {
        let user = await User.findById(id);
        const accessToken = jwt.sign({ user: { id: user.id, email: user.email } }, process.env.JWT_ACCESS_SECRET, { expiresIn: '30m' });
        const refreshToken = jwt.sign({ user: { id: user.id } }, process.env.JWT_REFRESH_SECRET, { expiresIn: '7d' });
        user.refreshToken = refreshToken;
        await user.save({ validateBeforeSave: false });
        return { accessToken, refreshToken };
    } catch (error) {
        return error;
    }
}

export const userRegistration = async (req, res) => {
    // get users details for frontend 
    // validation
    // check if user already exist - username , email
    // check for images , avtar
    // upload them to cloudinary
    // salt and hash the password
    // create a user object
    // generate the token
    //  create entry in db

    try {
        const { fullName, email, username, password } = req.body; // data from form and req body
    
        let user = await User.findOne({
            $or: [{ username }, { email }]
        });

    
        if (user) {
            return res.status(409).send({message: 'user with this username or email is exist' , success: false});
        }
    
        console.log(req.files);
    
        const avatarLocalPath = req.files?.avatar?.[0]?.path;
        const coverImageLocalPath = req.files?.coverImage?.[0]?.path;
    
        // if (!avatarLocalPath) {
        //     return res.status(409).send({message: 'Avatar image is required! ' , success: false});
        // }
        // const avatar = await uploadOnCloudinary(avatarLocalPath);
        // const coverImage = await uploadOnCloudinary(coverImageLocalPath);
    
        // if (!avatar) {
        //     return res.status(409).send({message: 'Avatar image is required1! ' , success: false});
        // }
    
        const salt = await bcrypt.genSalt(10);
        const newPass = await bcrypt.hash(password, salt);
    
        user = new User({
            fullName: fullName,
            email: email,
            username: username,
            password: newPass,
            avatar: avatarLocalPath || "",
            coverImage: coverImageLocalPath || "",
        });

        await user.save();
        res.send({message: "user register successfully" , success: true});
    } catch (error) {
        res.status(500).send({ message: "Internal Server Error", success: false });
    }
}

export const userLogin = async (req, res) => {
    const { email, username, password } = req.body;

    if (!username && !email) {
        return res.status(409).send({message:"please provide username or email for login" , success: false});
    }

    let user = await User.findOne({
        $or: [{ username }, { email }]
    });

    if (!user) {
        return res.status(409).send({message:"user with this username or email doesn't exist" , success: false});
    }

    const isUser = await bcrypt.compare(password, user.password);

    if (!isUser) {
        return res.status(409).send({message:"Invalid credentials!" , success: false});
    }

    const { refreshToken, accessToken } = await generateAccessTokenAndRefreshToken(user._id);
    
    console.log(accessToken);
    console.log(refreshToken);
    const options = {
        httpOnly: true,
        secure: true
    }
    return res
        .status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json({message: "user logged in successfully" , success: true})
}

export const loggOut = async (req, res) => {
    console.log(req.user.id);
    await User.findByIdAndUpdate(
        req.user.id,
        {
            $unset : {
                refreshToken : 1
            }
        }
    );

    const options = {
        httpOnly: true,
        secure: true
    }
    return res
        .status(200)
        .clearCookie("accessToken", options)
        .clearCookie("refreshToken", options)
        .json({message: "user loggOut successfully" , success: true});
}

export const refreshAccessToken = async (req, res) => {
    try {
        const incomingRefreshToken = req.cookies.refreshToken || req.body.refreshToken;
        if (!incomingRefreshToken) {
            return res.status(401).json({message: "unauthorize user" , success: false});
        }
        let decodedToken = jwt.verify(incomingRefreshToken, process.env.JWT_REFRESH_SECRET);
        let user = await User.findById(decodedToken?.user.id);
        if (!user) {
            return res.status(409).send({message: "Invalid refresh token" , success: false});
        }

        if (user?.refreshToken !== incomingRefreshToken) {
            return res.status(401).json({message:"Invalid refresh token or expired" , success: false});
        }

        const options = {
            httpOnly: true,
            secure: true
        }

        const { accessToken, refreshToken } = await generateAccessTokenAndRefreshToken(user._id);
        console.log(accessToken);
        return res
            .status(200)
            .cookie("accessToken", accessToken, options)
            .cookie("refreshToken", refreshToken, options)
            .json({message: "access token refresh successfully" , success: true});
    } catch (error) {
        res.status(401).json({message: error , success: false});
    }
}

export const changeCurrentPassword = async (req, res) => {
    const { currentPassword, oldPassword } = req.body;

    let user = await User.findById(req.user?._id);
    const isPasswordCorrect = await bcrypt.compare(oldPassword, user.password);

    if (!isPasswordCorrect) {
        return res.status(401).json("incorrect password")
    }
    const salt = await bcrypt.genSalt(10);
    const newPass = await bcrypt.hash(currentPassword, salt);
    user.password = newPass;
    await user.save({ validateBeforeSave: false });

    return res.status(200).json("password change successfully");
}

export const getUser = async (req, res) => {
    return res
        .status(200)
        .json({user : req.user , success:true});
}

export const updateAccountDetails = async (req, res) => {
    const { fullName, email } = req.body;

    if (!fullName && !email) {
        return res.status(401).json("fullname or email is required for update");
    }

    let user = await User.findById(req.user?._id,).select("-password");

    if(!user){
        return res.status(401).json("user not found");
    }

    if(fullName) user.fullName = fullName;
    if(email) user.email = email;

    const data = await user.save({ validateBeforeSave:false });

    return res
        .status(200)
        .json(data);

}

export const updateUserAvatar = async (req, res) => {
    const avatar = req.file?.path;
    if (!avatar) {
        return res.status(401).json("avatar file is missing");
    }

    let user = await User.findByIdAndUpdate(
        req.user?._id,
        {
            $set: {
                avatar: avatar
            }
        },
        { new: true } // return updated data
    ).select("-password");

    await user.save({ validateBeforeSave: false });
    return res.status(200).json("Avatar image updated successfully");
}

export const updateCoverImage = async (req, res) => {
    const coverImage = req.file?.path;
    if (!coverImage) {
        return res.status(401).json("cover image is missing");
    }

    let user = await User.findByIdAndUpdate(
        req.user?._id,
        {
            $set: {
                coverImage: coverImage
            }
        },
        { new: true } // return updated data
    ).select("-password");

    await user.save({ validateBeforeSave: false });
    return res.status(200).json("cover image updated successfully");
}

export const getUserChannel = async (req, res) => {
    try {
        const { username } = req.params;
        console.log(req.user.id);
        if (!username) {
            return res.status(400).json("can not get channel");
        }
    
        const channel = await User.aggregate([
            {
                $match: {
                    username: username
                }
            },
            {
                $lookup: {
                    from: 'subscribers',
                    localField: '_id',
                    foreignField: 'channel',
                    as: 'subscriber'
                }
            },
            {
                $lookup: {
                    from: 'subscribers',
                    localField: '_id',
                    foreignField: 'subscriber',
                    as: 'subscribeTo'
                }
            },
            {
                $addFields: {
                    subscriberCount: {
                        $size: "$subscriber"
                    },
                    subscribedToCount: {
                        $size: "$subscribeTo"
                    },
                    isSubscribed: {
                        $cond: {
                            if: { $in: [new mongoose.Types.ObjectId(req.user?.id), "$subscriber.subscriber"] },
                            then: true,
                            else: false
                        }
                    }
                }
            },
            {
                $project: {
                    // passed only selected fields
                    fullName: 1,
                    username: 1,
                    subscribedToCount: 1,
                    subscriberCount: 1,
                    isSubscribed: 1,
                    avatar: 1,
                    coverImage: 1,
                    email: 1
                }
            }
        ]);
        console.log(channel);
        if (!channel?.length) {
            return res.status(400).json("channel does not exists");
        }
        return res.status(200).json(channel[0]);
    } catch (error) {
        return res.status(401).json(error);
    }
}

export const getWatchHistory = async (req, res) => {
    const user = await User.aggregate([
        {
            $match: {
                _id: new mongoose.Types.ObjectId(req.user?.id)
            }
        },
        {
            $lookup: {
                from: 'videos',
                localField: 'watchHistory',
                foreignField: '_id',
                as: 'watchHistory',
                pipeline: [
                    {
                        $lookup: {
                            from: 'users',
                            localField: 'owner',
                            foreignField: '_id',
                            as: 'owner',
                            pipeline: [
                                {
                                    $project: {
                                        fullName: 1,
                                        username : 1,
                                        avatar : 1
                                    }
                                }
                            ]
                        }
                    } , 
                    {
                        $addFields: {
                            owner: {
                                $first: '$owner'
                            }
                        }
                    }
                ]
            }
        }
    ]);
    return res
    .status(200)
    .json(user);
}