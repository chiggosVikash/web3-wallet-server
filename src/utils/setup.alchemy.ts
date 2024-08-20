import dotenv from 'dotenv'
import {Network,Alchemy} from 'alchemy-sdk'
dotenv.config()

const settings = {
    apiKey: process.env.ALCHEMY_API_KEY,
    network: Network.ETH_MAINNET,
  };

export const alchemy = new Alchemy(settings);