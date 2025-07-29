"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ObjectValidator = ObjectValidator;
const mongoose_1 = require("mongoose");
function ObjectValidator(id) {
    if (!id || typeof id !== 'string' || !(0, mongoose_1.isValidObjectId)(id)) {
        return false;
    }
    return true;
}
