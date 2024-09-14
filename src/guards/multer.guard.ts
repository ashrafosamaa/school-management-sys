import * as multer from "multer";
import { allowedExtensions } from "src/utils/allowed-extension";
import { Request } from "express";

export const multerImages = {
    storage : multer.diskStorage({
        filename: (req: Request, file: any, cb: any) => {
            cb(null, file.originalname);
        },
    }),
    fileFilter : (req: Request, file: any, cb: any) => {
        if (allowedExtensions.images.includes(file.mimetype.split("/")[1])) {
            return cb(null, true);
        }
        cb(new Error("file format is not allowed!"), false);
    },
    // file : multer({ fileFilter, storage })
    // return file
}
