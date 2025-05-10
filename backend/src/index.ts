import express from 'express';
import { processEmail } from './emailProcessor';
import { Email } from '../../shared/types';

const app = express();
app.use(express.json());

app.post('/api/process', async (req, res) => {
  try {
    const email: Email = req.body;
    const processed = await processEmail(email);
    res.json(processed);
  } catch (error) {
    res.status(500).json({ error: 'Processing failed' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`ZEMS backend running on port ${PORT}`));