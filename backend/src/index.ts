import express from 'express';
import { processEmail } from './emailProcessor';

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 3000;

app.post('/api/process', async (req, res) => {
  try {
    const { email } = req.body;
    const result = await processEmail(email);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: 'Processing failed' });
  }
});

app.listen(PORT, () => {
  console.log(`ZEMS backend running on port ${PORT}`);
});