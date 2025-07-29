"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ObjectIdConvert = ObjectIdConvert;
const mongoose_1 = require("mongoose");
function ObjectIdConvert(id) {
    return new mongoose_1.Types.ObjectId(id);
}
