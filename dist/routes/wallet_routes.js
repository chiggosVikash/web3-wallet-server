"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const solana_wallet_controller_1 = require("../controllers/solana_wallet_controller");
const ethereum_wallet_controller_1 = require("../controllers/ethereum_wallet_controller");
const router = express_1.default.Router();
const solanaWalletController = new solana_wallet_controller_1.SolanaWalletController();
const ethereumWalletController = new ethereum_wallet_controller_1.EthereumWalletController();
router.post('/create-wallet', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // console.log(req.body);
        const { walletType, recoveryPhrase, currentIndex } = req.body;
        if (walletType == 'solana') {
            const wallet = yield solanaWalletController.generateNewWallet({ recoveryPhrase, currentIndex });
            res.status(200).send(wallet);
            // derived path m/44'/501'/0'/0'
        }
        else if (walletType == 'ethereum') {
            const wallet = yield ethereumWalletController.generateNewWallet({ recoveryPhrase, currentIndex });
            res.status(200).send(wallet);
            // derived path m/44'/60'/0'/0'
        }
    }
    catch (e) {
        res.status(500).send('Internal Server Error');
    }
}));
router.post('/check-balance', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { walletType, publicKey } = req.body;
        if (walletType == 'solana') {
            const balance = yield solanaWalletController.checkWalletBalance({ publicKey });
            res.status(200).send({ balance }); // in SOL
        }
        else if (walletType == 'ethereum') {
            // const balance = await ethereumWalletController.checkWalletBalance({publicKey});
            res.status(200).send({ balance: 'Not Implemented' });
        }
    }
    catch (e) {
        res.status(500).send('Internal Server Error');
    }
}));
exports.default = router;
