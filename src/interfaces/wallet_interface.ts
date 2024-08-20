
interface WalletInterface {
    generateNewWallet({recoveryPhrase,currentIndex}:{recoveryPhrase: string,currentIndex:number}): Promise<{privateKey: string, publicKey: string, walletType: string}>
    checkWalletBalance({publicKey}:{publicKey: string,}): Promise<number>
    transferFund({destinationAddress,amount,privateKey}:{destinationAddress: string,amount: number,privateKey: string}): Promise<string>
}

export default WalletInterface
