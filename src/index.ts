import express from 'express';
import cors from 'cors';

const app = express();

app.use(cors())

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
    res.send('<h1>Hello World</h1>');
})

import accountRoute from './routes/account_route'
import walletRoute from './routes/wallet_routes'


app.use('/account',accountRoute)
app.use('/wallet',walletRoute)


app.listen(3000, () => {
    console.log("Server is running on port 3000");
})

export default app;

