"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.get('/', (req, res) => {
    res.send('<h1>Hello World</h1>');
});
const account_route_1 = __importDefault(require("./routes/account_route"));
const wallet_routes_1 = __importDefault(require("./routes/wallet_routes"));
app.use('/account', account_route_1.default);
app.use('/wallet', wallet_routes_1.default);
app.listen(3000, () => {
    console.log("Server is running on port 3000");
});
exports.default = app;
