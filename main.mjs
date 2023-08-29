import express from 'express';
import { summaly } from 'summaly';

const app = express();
app.listen(process.env.PORT, () => console.log(`Server running on port 3000 ${process.env.PORT}`));

// cors from environment variable
const cors = process.env.CORS || '*';
app.use(require('cors')({ origin: cors }));

app.get("/", async (req, res) => {
    const url = req.query.url;
    if (!url) return res.status(400).json({ error: 'url query is required' });

    try {
        const result = await summaly(url);
        res.json(result);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});