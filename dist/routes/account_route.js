"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const wallet_bip39_controller_1 = require("../controllers/wallet_bip39_controller");
const router = express_1.default.Router();
const walletBip39Controller = new wallet_bip39_controller_1.WalletBip39Controller().getInstance();
router.post('/recovery-phrase', (req, res) => {
    try {
        const wordsInStr = req.body.words;
        const words = parseInt(wordsInStr !== null && wordsInStr !== void 0 ? wordsInStr : "12");
        const mnemonic = walletBip39Controller.generateNewMnemonic({ words: words });
        res.status(200).send(mnemonic);
    }
    catch (e) {
        res.status(500).send(e);
    }
});
exports.default = router;
