import express from 'express';
import fetch from 'node-fetch';
import dotenv from 'dotenv';
dotenv.config();

const app = express();
const API_KEY = process.env.VITE_APP_FOOTBALL_API_KEY;
const API_URL = process.env.VITE_APP_API_ENDPOINT_URL || 'https://api.football-data.org/v4/';

// Middleware CORS
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, X-Auth-Token, Authorization');
  res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  if (req.method === 'OPTIONS') {
    return res.sendStatus(204);
  }
  next();
});

// Proxy pour toutes les routes /api/*
app.use(/^\/api\/(.*)/, async (req, res) => {
  const path = req.params[0];
  const url = API_URL.replace(/\/$/, '') + '/' + path + (req._parsedUrl.search || '');
  try {
    const response = await fetch(url, {
      headers: { 'X-Auth-Token': API_KEY }
    });
    const contentType = response.headers.get('content-type');
    res.status(response.status);
    if (contentType && contentType.includes('application/json')) {
      res.json(await response.json());
    } else {
      res.send(await response.text());
    }
  } catch (err) {
    res.status(500).json({ error: 'Erreur proxy', details: err.message });
  }
});

const PORT = process.env.PROXY_PORT || 3005;
app.listen(PORT, () => console.log(`Proxy running on port ${PORT}`)); 