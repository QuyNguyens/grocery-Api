"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadImage = void 0;
// services/cloudinary.service.ts
const stream_1 = require("stream");
const cloudinary_1 = __importDefault(require("../../config/cloudinary"));
const bufferToStream = (buffer) => {
    const readable = new stream_1.Readable();
    readable.push(buffer);
    readable.push(null);
    return readable;
};
const extractPublicId = (url) => {
    const matches = url.match(/\/upload\/(?:v\d+\/)?([^\.]+)\./);
    return matches ? matches[1] : null;
};
const uploadImage = async (buffer, folder, oldImageUrl) => {
    if (oldImageUrl) {
        const publicId = extractPublicId(oldImageUrl);
        if (publicId) {
            await cloudinary_1.default.uploader.destroy(publicId);
        }
    }
    return new Promise((resolve, reject) => {
        const stream = cloudinary_1.default.uploader.upload_stream({ folder }, (err, result) => {
            if (err || !result)
                return reject(err || new Error('Upload failed'));
            resolve(result.secure_url);
        });
        bufferToStream(buffer).pipe(stream);
    });
};
exports.uploadImage = uploadImage;
