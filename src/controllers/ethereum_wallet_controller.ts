import WalletInterface from "../interfaces/wallet_interface";
import WalletBip39Controller from "./wallet_bip39_controller";
import { Wallet, HDNodeWallet,ethers } from "ethers";

export class EthereumWalletController implements WalletInterface{

    /**
     * Retrieves a JSON-RPC provider for Ethereum.
     * @returns The JSON-RPC provider.
     */
    private getJsonRpcProvider(): ethers.JsonRpcProvider {
        const provider = new ethers.JsonRpcProvider(`https://eth-sepolia.g.alchemy.com/v2/${process.env.API_KEY}`)
        return provider;
    }
    /**
     * Retrieves the balance of a wallet associated with the given public key.
     * 
     * @param {string} publicKey - The public key of the wallet.
     * @returns {Promise<number>} - The balance of the wallet in ETH.
     */
    async checkWalletBalance({ publicKey, }: { publicKey: string; }): Promise<number> {
         // Connect to the Alchemy API
         const provider = this.getJsonRpcProvider();
         const balance = await provider.getBalance(publicKey)
        // convert Wei to ETH
        const balanceInEth = ethers.formatEther(balance);
        return parseFloat(balanceInEth);

        
    }
    /**
     * Generates a new Ethereum wallet.
     * 
     * @param recoveryPhrase - The recovery phrase used to generate the wallet seed.
     * @param currentIndex - The current index used in the derivation path.
     * @returns A promise that resolves to an object containing the generated wallet's private key, public key, wallet type, wallet name, wallet balance, and unit.
     */
    public async generateNewWallet({ recoveryPhrase, currentIndex }
        : { recoveryPhrase: string; currentIndex: number; }): Promise<{ privateKey: string; publicKey: string; walletType: string; 

            walletName: string; walletBalance: number; unit: string;
        }> {

         const derivationPath = `m/44'/60'/${currentIndex}'/0'`; // m is the master key, 44' is the BIP44 standard for the coin type, 60' is the coin type for Ethereum, 0' is the account index, 0' is the change index
        const seed = await new WalletBip39Controller().getInstance().generateSeedFromMnemonic(recoveryPhrase);
        const hdNode = HDNodeWallet.fromSeed(seed);
        const child = hdNode.derivePath(derivationPath);
        const privateKey = child.privateKey;
        const wallet = new Wallet(privateKey)
        const walletBalance = await this.checkWalletBalance({ publicKey: wallet.address });
        return {
            privateKey: privateKey,
            publicKey: wallet.address,
            walletType: 'ethereum',
            walletName:  `ethereum Wallet ${currentIndex}`,
            walletBalance: walletBalance,
            unit: 'ETH',
        }
    }

    /**
     * Transfers funds from the current wallet to a specified destination address.
     * 
     * @param destinationAddress - The address where the funds will be transferred.
     * @param amount - The amount of funds to transfer.
     * @param privateKey - The private key of the current wallet.
     * @returns A promise that resolves to the transaction hash if the transfer is successful.
     * @throws An error if the transaction fails.
     */
    public async transferFund({destinationAddress, amount, privateKey}
        : {destinationAddress: string; amount: number; privateKey: string; }): Promise<string> {
            const provider = this.getJsonRpcProvider();
        const wallet = new Wallet(privateKey,provider);
        const tx = {
            to: destinationAddress,
            value: ethers.formatEther(amount), // in Eth, so 1 Eth = 1e18 Wei
            gasLimit: 21000,
            gasPrice: await wallet.estimateGas({ to: destinationAddress, value: ethers.parseEther(amount.toString()) }),

        }

        const transaction = await wallet.sendTransaction(tx);
        const receipt = await transaction.wait();
        if(receipt == null){
            throw new Error('Transaction failed');
        }
        return receipt?.hash;
    }
    
}