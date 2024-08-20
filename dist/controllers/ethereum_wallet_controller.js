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
exports.EthereumWalletController = void 0;
const wallet_bip39_controller_1 = __importDefault(require("./wallet_bip39_controller"));
const ethers_1 = require("ethers");
class EthereumWalletController {
    checkWalletBalance(_a) {
        return __awaiter(this, arguments, void 0, function* ({ publicKey, }) {
            // Connect to the Alchemy API
            const provider = new ethers_1.ethers.JsonRpcProvider(`https://eth-sepolia.g.alchemy.com/v2/${process.env.API_KEY}`);
            const balance = yield provider.getBalance(publicKey);
            // convert Wei to ETH
            const balanceInEth = ethers_1.ethers.formatEther(balance);
            return parseFloat(balanceInEth);
        });
    }
    generateNewWallet(_a) {
        return __awaiter(this, arguments, void 0, function* ({ recoveryPhrase, currentIndex }) {
            const derivationPath = `m/44'/60'/${currentIndex}'/0'`;
            const seed = yield new wallet_bip39_controller_1.default().getInstance().generateSeedFromMnemonic(recoveryPhrase);
            const hdNode = ethers_1.HDNodeWallet.fromSeed(seed);
            const child = hdNode.derivePath(derivationPath);
            const privateKey = child.privateKey;
            const wallet = new ethers_1.Wallet(privateKey);
            const walletBalance = yield this.checkWalletBalance({ publicKey: wallet.address });
            return {
                privateKey: privateKey,
                publicKey: wallet.address,
                walletType: 'ethereum',
                walletName: `ethereum Wallet ${currentIndex}`,
                walletBalance: walletBalance,
                unit: 'ETH',
            };
        });
    }
}
exports.EthereumWalletController = EthereumWalletController;
