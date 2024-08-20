"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.alchemy = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
const alchemy_sdk_1 = require("alchemy-sdk");
dotenv_1.default.config();
const settings = {
    apiKey: process.env.ALCHEMY_API_KEY,
    network: alchemy_sdk_1.Network.ETH_MAINNET,
};
exports.alchemy = new alchemy_sdk_1.Alchemy(settings);
