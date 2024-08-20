import { Keypair,Connection,PublicKey,LAMPORTS_PER_SOL, SystemProgram, Transaction,sendAndConfirmTransaction } from "@solana/web3.js";
import { derivePath } from "ed25519-hd-key";
import {WalletBip39Controller} from '../controllers/wallet_bip39_controller'
import nacl from "tweetnacl"
import WalletInterface from "../interfaces/wallet_interface";
import dotenv from 'dotenv'
dotenv.config()




export class SolanaWalletController implements WalletInterface{

    /**
     * Transfers funds from the current wallet to a destination address.
     * 
     * @param {string} destinationAddress - The address where the funds will be transferred.
     * @param {number} amount - The amount of funds to transfer.
     * @param {string} privateKey - The private key of the current wallet.
     * @returns {Promise<string>} - A promise that resolves to the transaction hash of the transfer.
     */
    public async transferFund({ destinationAddress, amount, privateKey }: 
        { destinationAddress: string; amount: number; privateKey: string; }): Promise<string> {
        const connection = await this.connectWallet();
        const secretKey = Uint8Array.from(Buffer.from(privateKey, 'hex'));
        const keypair = Keypair.fromSecretKey(secretKey);
        const transaction = new Transaction().add(
            SystemProgram.transfer({
                fromPubkey: keypair.publicKey,
                toPubkey: new PublicKey(destinationAddress),
                lamports: amount * LAMPORTS_PER_SOL,
            }),
        );

        const hash = await sendAndConfirmTransaction(connection,transaction, [keypair]);
        return hash;



        
    }

    private connection?: Connection;

    /**
     * Connects to the Solana wallet.
     * 
     * @returns A promise that resolves to a Connection object representing the connection to the Solana wallet.
     */
    private async connectWallet(): Promise<Connection> {
        if(this.connection !== undefined && this.connection !== null){
            return this.connection;
        }
        //  this.connection = new Connection(clusterApiUrl('devnet'));
        this.connection = new Connection(`https://solana-devnet.g.alchemy.com/v2/${process.env.API_KEY}`, 'confirmed'); 
        return this.connection;

    }

    /**
     * Checks the balance of a Solana wallet.
     * 
     * @param publicKey - The public key of the wallet.
     * @returns The balance of the wallet in SOL.
     * @throws Error if the public key is not provided or if the connection to the Solana network fails.
     */
    public async checkWalletBalance({ publicKey}: { publicKey: string;}): Promise<number> {

        const connection = await this.connectWallet();
        if(!publicKey){
            throw new Error('Public key is required');
        }
        if(connection == null){
            throw new Error('Connection to Solana network failed');
        }
        const pubKey = new PublicKey(publicKey);
        const balance = await connection.getBalance(pubKey); // in lamports
        return (balance / LAMPORTS_PER_SOL) // in SOL
    }


    /**
     * Generates a new wallet from a given seed.
     * 
     * @param seed - The seed to generate the wallet from.
     * @returns A promise that resolves to an object containing the private key, public key and wallet type.
     */
    
    public async generateNewWallet({recoveryPhrase, currentIndex}:{recoveryPhrase: string,currentIndex:number})
        : Promise<{privateKey: string, publicKey: string, walletType: string,walletName: string,walletBalance: number,unit: string}> {

        // derived path m/44'/501'/0'/0' // Explation - m is the master key, 44' is the BIP44 standard for the coin type, 501' is the coin type for Solana, 0' is the account index, 0' is the change index
        const path = `m/44'/501'/${currentIndex}'/0'`;
        const seed = await new WalletBip39Controller().getInstance().generateSeedFromMnemonic(recoveryPhrase);
        const derivedSeed = derivePath(path, seed.toString("hex")).key;
        const secret = nacl.sign.keyPair.fromSeed(derivedSeed).secretKey;
        const keypair = Keypair.fromSecretKey(secret);
        const publicKey = keypair.publicKey.toBase58();
        const walletBalance = await this.checkWalletBalance({publicKey: publicKey});// in SOL
        return {
            privateKey: Buffer.from(keypair.secretKey).toString('hex'),
            publicKey: publicKey,
            walletType: 'solana',
            walletName:  `Solana Wallet ${currentIndex}`,
            walletBalance: walletBalance,
            unit: 'SOL',
        }
    }

  
    


  


}