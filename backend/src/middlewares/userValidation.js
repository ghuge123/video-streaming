import { validationResult } from "express-validator";

export const validate = (req, res, next) => {
    console.log("Request Body:", req.body);
    console.log("Uploaded File:", req.file);

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    next();
};
