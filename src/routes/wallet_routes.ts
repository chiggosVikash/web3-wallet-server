
import express from 'express';
import {SolanaWalletController} from '../controllers/solana_wallet_controller'
import {EthereumWalletController} from '../controllers/ethereum_wallet_controller'
const router = express.Router();


const solanaWalletController = new SolanaWalletController();
const ethereumWalletController = new EthereumWalletController();


router.post('/create-wallet', async(req, res) => {
    try{
        // console.log(req.body);
        const {walletType, recoveryPhrase, currentIndex} = req.body;
        if(walletType == 'solana'){

            const wallet = await solanaWalletController.generateNewWallet({recoveryPhrase, currentIndex});
            res.status(200).send(wallet);
            // derived path m/44'/501'/0'/0'
        }else if(walletType == 'ethereum'){
                const wallet = await ethereumWalletController.generateNewWallet({recoveryPhrase, currentIndex});
                res.status(200).send(wallet);
                // derived path m/44'/60'/0'/0'
        }
    }catch(e){
        res.status(500).send('Internal Server Error');
    }
});

router.post('/check-balance', async(req, res) => {
    try{
        const {walletType, publicKey} = req.body;
        if(walletType == 'solana'){
            const balance = await solanaWalletController.checkWalletBalance({publicKey});
            res.status(200).send({balance}); // in SOL
        }else if(walletType == 'ethereum'){
            const balance = await ethereumWalletController.checkWalletBalance({publicKey});
            res.status(200).send({balance: balance}); // in ETH
        }
    }catch(e){
        res.status(500).send('Internal Server Error');
    }
});

router.post('/transfer-fund', async(req, res) => {
    try{
         const privateKey = req.body.privateKey;
         const walletType = req.body.walletType;
         const destinationAddress = req.body.destinationAddress;
        if(walletType == 'solana'){
            const amount = parseFloat(req.body.amount) 
            const hash = await solanaWalletController.transferFund({destinationAddress, amount, privateKey});
            res.status(200).send({hash});
        }else if(walletType == 'ethereum'){
            const amount = parseFloat(req.body.amount)
            const hash = await ethereumWalletController.transferFund({destinationAddress, amount, privateKey});
            res.status(200).send({hash: hash});
        }
    }catch(e){

    }
})

export default router