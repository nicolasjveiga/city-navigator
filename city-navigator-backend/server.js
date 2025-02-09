const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');

const app = express();
app.use(cors());

const API_KEY = 'AIzaSyAEK6lr2cl6ncyWsS6Spo3T_dd2M83xa5c';
app.get('/city-photo/:placeId', async (req, res) => {
    const placeId = req.params.placeId;
    const url = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=photos&key=${API_KEY}`;

    try {
        const response = await fetch(url);
        const data = await response.json();

        if (data.result && data.result.photos && data.result.photos.length > 0) {
            const photoReference = data.result.photos[0].photo_reference;
            const photoUrl = `https://maps.googleapis.com/maps/api/place/photo?maxwidth=600&photoreference=${photoReference}&key=${API_KEY}`;
            res.json({ photoUrl });
        } else {
            res.status(404).json({ error: 'Nenhuma foto encontrada' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Erro ao buscar a foto' });
    }
});

app.listen(3000, () => console.log('Servidor rodando na porta 3000 🚀'));
