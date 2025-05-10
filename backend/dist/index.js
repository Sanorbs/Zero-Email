"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const emailProcessor_1 = require("./emailProcessor");
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.post('/api/process', async (req, res) => {
    try {
        const email = req.body;
        const processed = await (0, emailProcessor_1.processEmail)(email);
        res.json(processed);
    }
    catch (error) {
        res.status(500).json({ error: 'Processing failed' });
    }
});
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`ZEMS backend running on port ${PORT}`));
