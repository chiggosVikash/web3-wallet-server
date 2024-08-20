import express from 'express';
import  {WalletBip39Controller} from '../controllers/wallet_bip39_controller'

const router = express.Router();

const walletBip39Controller = new WalletBip39Controller().getInstance();

router.post('/recovery-phrase', (req, res) => {
    try{
        const wordsInStr = req.body.words;
        const words = parseInt(wordsInStr ?? "12");
        const mnemonic = walletBip39Controller.generateNewMnemonic({words: words});
        res.status(200).send(mnemonic);
    }catch(e){
        res.status(500).send(e);
    }
});

export default router