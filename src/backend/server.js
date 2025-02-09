const express = require('express');
const cors = require('cors');
const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));
const NodeCache = require('node-cache');

const app = express();
app.use(cors());
app.use(express.json());

const API_KEY = 'AIzaSyAEK6lr2cl6ncyWsS6Spo3T_dd2M83xa5c';
const cache = new NodeCache({ stdTTL: 3600 }); 


app.get('/tourist-attractions/:city', async (req, res) => {
  const city = decodeURIComponent(req.params.city.toLowerCase().trim());

  const cachedData = cache.get(city);
  if (cachedData) {
    console.log(`✅ Cache HIT para: ${city}`);
    return res.json({ places: cachedData });
  }

  console.log(`Cache MISS. Buscando na API para: ${city}`);

  const encodedCity = encodeURIComponent(city);
  const url = `https://maps.googleapis.com/maps/api/place/textsearch/json?query=tourist+attractions+in+${encodedCity}&key=${API_KEY}`;

  try {
    const response = await fetch(url);
    const data = await response.json();

    console.log(" Resposta da API do Google:", data);

    if (!data.results || data.results.length === 0) {
      return res.status(404).json({ error: "Nenhum resultado encontrado." });
    }

    const places = data.results.map(place => ({
      name: place.name,
      rating: place.rating || "Sem avaliação",
      photo: place.photos
        ? `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${place.photos[0].photo_reference}&key=${API_KEY}`
        : 'https://via.placeholder.com/400'
    }));

    cache.set(city, places);
    console.log(`🗄️ Dados armazenados no cache para: ${city}`);

    res.json({ places });
  } catch (error) {
    console.error("Erro ao buscar locais turísticos:", error);
    res.status(500).json({ error: "Erro ao buscar locais turísticos", details: error.message });
  }
});


app.post('/add-user', async (req, res) => {
  const newUser = req.body;

  try {
    const response = await fetch('http://localhost:3001/users', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newUser)
    });

    const data = await response.json();
    console.log("✅ Usuário cadastrado:", data);

    res.json(data);
  } catch (error) {
    console.error("Erro ao cadastrar usuário:", error);
    res.status(500).json({ error: "Erro ao cadastrar usuário", details: error.message });
  }
});

const PORT = 3000;
app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));
