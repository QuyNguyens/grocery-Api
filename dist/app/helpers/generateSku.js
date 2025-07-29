"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateSku = generateSku;
function generateSku() {
    const letters = () => Array.from({ length: 4 }, () => String.fromCharCode(65 + Math.floor(Math.random() * 26)) // A-Z
    ).join('');
    const numbers = () => Math.floor(1000 + Math.random() * 9000).toString(); // 4-digit number
    return `${letters()}-${numbers()}-${letters()}`;
}
