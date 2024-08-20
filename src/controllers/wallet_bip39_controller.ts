import {generateMnemonic,validateMnemonic,mnemonicToSeed} from 'bip39'

export class WalletBip39Controller {

     private instance?: WalletBip39Controller;

     public getInstance(){
            if(!this.instance){
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
   public generateNewMnemonic({words = 12}):string {
        const bits = words == 12 ? 128 : 256 /// 12 words = 128 bits, 24 words = 256 bits
        return generateMnemonic(bits);
   }


/**
 * Validates a mnemonic.
 *
 * @param mnemonic - The mnemonic to validate.
 * @returns True if the mnemonic is valid, false otherwise.
 */
   private validateMnemonic(mnemonic: string): boolean {
        return validateMnemonic(mnemonic)
   }


/**
 * Generates a seed from a given mnemonic.
 * 
 * @param mnemonic - The mnemonic string to generate the seed from.
 * @returns A promise that resolves to a Buffer containing the generated seed.
 * @throws Error if the provided mnemonic is invalid.
 */
   public async generateSeedFromMnemonic(mnemonic: string): Promise<Buffer> {
        if(!this.validateMnemonic(mnemonic)) {
            throw new Error('Invalid Mnemonic')
        }
        return await mnemonicToSeed(mnemonic)
   }

/**
 * Generates a new seed using BIP39 standard.
 * 
 * @param {number} words - The number of words in the mnemonic (default: 12).
 * @returns {Promise<Buffer>} - A promise that resolves to the generated seed as a Buffer.
 */
   public async generateNewSeed({words = 12}): Promise<Buffer> {
        const mnemonic = this.generateNewMnemonic({words})
        return await this.generateSeedFromMnemonic(mnemonic);
   }


    
}

export default WalletBip39Controller;
