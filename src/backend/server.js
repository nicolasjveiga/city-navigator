const express = require('express');
const cors = require('cors');
const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));
const NodeCache = require('node-cache');

const app = express();
app.use(cors());
app.use(express.json());

const API_KEY = 'AIzaSyAEK6lr2cl6ncyWsS6Spo3T_dd2M83xa5c';
const WIKIPEDIA_API_URL = 'https://en.wikipedia.org/api/rest_v1/page/summary';
const cache = new NodeCache({ stdTTL: 86400 });

const topCities = [
  "Tokyo, Japan",
  "Rome, Italy",
  "Milan, Italy",
  "New York, USA",
  "Amsterdam, Netherlands",
  "Sydney, Australia",
  "Singapore",
  "Barcelona, Spain"
];

async function fetchTouristAttractions(city) {
  const encodedCity = encodeURIComponent(city);
  const url = `https://maps.googleapis.com/maps/api/place/textsearch/json?query=top+tourist+attractions+in+${encodedCity}&key=${API_KEY}`;

  try {
    const response = await fetch(url);
    const data = await response.json();

    if (!data.results || data.results.length === 0) {
      return [];
    }

    return data.results.map(place => ({
      name: place.name,
      place_id: place.place_id,
      city: city,
      rating: place.rating || 0,
      photo: place.photos
        ? `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${place.photos[0].photo_reference}&key=${API_KEY}`
        : 'https://via.placeholder.com/400'
    })).sort((a, b) => b.rating - a.rating);
  } catch (error) {
    console.error("Erro em fetchTouristAttractions:", error);
    return [];
  }
}

app.get('/', (req, res) => {
  res.send('API funcionando');
});


async function fetchWikipediaExtract(placeName) {
  const url = `https://en.wikipedia.org/w/api.php?action=query&prop=extracts&titles=${encodeURIComponent(placeName)}&format=json&explaintext=0&origin=*`;
  try {
    const response = await fetch(url);
    const data = await response.json();
   
    const pages = data.query.pages;
    const pageId = Object.keys(pages)[0];
    if (pageId === "-1") {
      return "Nenhuma informação disponível na Wikipedia.";
    }
    const extract = pages[pageId].extract;
    return extract || "Nenhuma informação disponível na Wikipedia.";
  } catch (error) {
    console.error("Erro ao buscar informações da Wikipedia:", error);
    return "Erro ao carregar informações da Wikipedia.";
  }
}


app.get('/top-cities-attractions', async (req, res) => {
  const cacheKey = "topCities";
  const cachedData = cache.get(cacheKey);
  if (cachedData) {
    return res.json({ places: cachedData });
  }
  let allPlaces = [];
  for (const city of topCities) {
    const places = await fetchTouristAttractions(city);
    allPlaces = allPlaces.concat(places);
  }

  allPlaces = allPlaces.sort((a, b) => b.rating - a.rating).slice(0, 8);
  cache.set(cacheKey, allPlaces);
  res.json({ places: allPlaces });
});


app.get('/tourist-attractions/:city', async (req, res) => {
  const city = decodeURIComponent(req.params.city);
  const cacheKey = `tourist-attractions-${city}`;
  const cachedData = cache.get(cacheKey);
  if (cachedData) {
    return res.json({ places: cachedData });
  }
  const places = await fetchTouristAttractions(city);
  if (places.length === 0) {
    return res.status(404).json({ message: "Nenhum local encontrado para esta cidade." });
  }
  cache.set(cacheKey, places);
  res.json({ places });
});

app.get('/place-details/:place_id', async (req, res) => {
  const placeId = req.params.place_id;
  console.log("Requisição para detalhes do lugar com place_id:", placeId);
  const cacheKey = `place-details-${placeId}`;
  const cachedData = cache.get(cacheKey);
  if (cachedData) {
    return res.json({ details: cachedData });
  }
  
  const url = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=name,rating,formatted_address,formatted_phone_number,website,opening_hours,editorial_summary&key=${API_KEY}`;
  
  try {
    const response = await fetch(url);
    const data = await response.json();
    if (!data.result) {
      return res.status(404).json({ message: "Detalhes não encontrados." });
    }
    const placeDetails = {
      name: data.result.name,
      rating: data.result.rating || "Sem avaliação",
      address: data.result.formatted_address || "Endereço não disponível",
      phone: data.result.formatted_phone_number || "Telefone não disponível",
      website: data.result.website || "Site não disponível",
      opening_hours: data.result.opening_hours ? data.result.opening_hours.weekday_text : "Horário não disponível"
      
    };
    
  
    const wikipediaExtract = await fetchWikipediaExtract(placeDetails.name);
    placeDetails.description = wikipediaExtract;
    
    cache.set(cacheKey, placeDetails);
    res.json({ details: placeDetails });
  } catch (error) {
    console.error("Erro ao buscar detalhes do lugar:", error);
    res.status(500).json({ message: "Erro ao buscar os detalhes do lugar." });
  }
});


const PORT = 3000;
app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));
