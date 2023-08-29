import express from 'express';
import { summaly } from 'summaly';
import cors from 'cors';

const app = express();
app.listen(process.env.PORT, () => console.log(`Server running on port 3000 ${process.env.PORT}`));

// cors from environment variable
const corsValiable = process.env.CORS || '*';
app.use(cors({ origin: corsValiable }));

app.get("/", async (req, res) => {
    const url = req.query.url;
    if (!url) return res.status(400).json({ error: 'url query is required' });

    try {
        const result = await summaly(url);
        console.log(`summaly: ${url}`)
        res.json(result);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
});