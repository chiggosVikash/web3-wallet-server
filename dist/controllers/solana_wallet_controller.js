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
exports.SolanaWalletController = void 0;
const web3_js_1 = require("@solana/web3.js");
const ed25519_hd_key_1 = require("ed25519-hd-key");
const wallet_bip39_controller_1 = require("../controllers/wallet_bip39_controller");
const tweetnacl_1 = __importDefault(require("tweetnacl"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
class SolanaWalletController {
    connectWallet() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.connection !== undefined && this.connection !== null) {
                return this.connection;
            }
            //  this.connection = new Connection(clusterApiUrl('devnet'));
            this.connection = new web3_js_1.Connection(`https://solana-devnet.g.alchemy.com/v2/${process.env.API_KEY}`, 'confirmed');
            return this.connection;
        });
    }
    checkWalletBalance(_a) {
        return __awaiter(this, arguments, void 0, function* ({ publicKey }) {
            const connection = yield this.connectWallet();
            if (!publicKey) {
                throw new Error('Public key is required');
            }
            if (connection == null) {
                throw new Error('Connection to Solana network failed');
            }
            const pubKey = new web3_js_1.PublicKey(publicKey);
            const balance = yield connection.getBalance(pubKey); // in lamports
            return (balance / web3_js_1.LAMPORTS_PER_SOL); // in SOL
        });
    }
    /**
     * Generates a new wallet from a given seed.
     *
     * @param seed - The seed to generate the wallet from.
     * @returns A promise that resolves to an object containing the private key, public key and wallet type.
     */
    generateNewWallet(_a) {
        return __awaiter(this, arguments, void 0, function* ({ recoveryPhrase, currentIndex }) {
            // derived path m/44'/501'/0'/0'
            const path = `m/44'/501'/${currentIndex}'/0'`;
            const seed = yield new wallet_bip39_controller_1.WalletBip39Controller().getInstance().generateSeedFromMnemonic(recoveryPhrase);
            const derivedSeed = (0, ed25519_hd_key_1.derivePath)(path, seed.toString("hex")).key;
            const secret = tweetnacl_1.default.sign.keyPair.fromSeed(derivedSeed).secretKey;
            const keypair = web3_js_1.Keypair.fromSecretKey(secret);
            const publicKey = keypair.publicKey.toBase58();
            const walletBalance = yield this.checkWalletBalance({ publicKey: publicKey }); // in SOL
            return {
                privateKey: Buffer.from(keypair.secretKey).toString('hex'),
                publicKey: publicKey,
                walletType: 'solana',
                walletName: `Solana Wallet ${currentIndex}`,
                walletBalance: walletBalance,
                unit: 'SOL',
            };
        });
    }
}
exports.SolanaWalletController = SolanaWalletController;
