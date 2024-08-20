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
Object.defineProperty(exports, "__esModule", { value: true });
exports.WalletBip39Controller = void 0;
const bip39_1 = require("bip39");
class WalletBip39Controller {
    getInstance() {
        if (!this.instance) {
            this.instance = new WalletBip39Controller();
        }
        return this.instance;
    }
    /**
     * Generates a new mnemonic phrase.
     *
     * @param {number} words - The number of words in the mnemonic phrase. Default is 12.
     * @returns {string} The generated mnemonic phrase.
     */
    generateNewMnemonic({ words = 12 }) {
        const bits = words == 12 ? 128 : 256; /// 12 words = 128 bits, 24 words = 256 bits
        return (0, bip39_1.generateMnemonic)(bits);
    }
    /**
     * Validates a mnemonic.
     *
     * @param mnemonic - The mnemonic to validate.
     * @returns True if the mnemonic is valid, false otherwise.
     */
    validateMnemonic(mnemonic) {
        return (0, bip39_1.validateMnemonic)(mnemonic);
    }
    /**
     * Generates a seed from a given mnemonic.
     *
     * @param mnemonic - The mnemonic string to generate the seed from.
     * @returns A promise that resolves to a Buffer containing the generated seed.
     * @throws Error if the provided mnemonic is invalid.
     */
    generateSeedFromMnemonic(mnemonic) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.validateMnemonic(mnemonic)) {
                throw new Error('Invalid Mnemonic');
            }
            return yield (0, bip39_1.mnemonicToSeed)(mnemonic);
        });
    }
    /**
     * Generates a new seed using BIP39 standard.
     *
     * @param {number} words - The number of words in the mnemonic (default: 12).
     * @returns {Promise<Buffer>} - A promise that resolves to the generated seed as a Buffer.
     */
    generateNewSeed(_a) {
        return __awaiter(this, arguments, void 0, function* ({ words = 12 }) {
            const mnemonic = this.generateNewMnemonic({ words });
            return yield this.generateSeedFromMnemonic(mnemonic);
        });
    }
}
exports.WalletBip39Controller = WalletBip39Controller;
exports.default = WalletBip39Controller;
