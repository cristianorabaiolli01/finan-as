const express = require('express');
const axios = require('axios');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static('.'));

const PLUGGY_CLIENT_ID = process.env.PLUGGY_CLIENT_ID;
const PLUGGY_CLIENT_SECRET = process.env.PLUGGY_CLIENT_SECRET;
const PLUGGY_API_URL = 'https://api.pluggy.ai';

let accessToken = null;

// Obter token de acesso
async function getAccessToken() {
    if (accessToken) return accessToken;
    
    try {
        const response = await axios.post(`${PLUGGY_API_URL}/auth`, {
            clientId: PLUGGY_CLIENT_ID,
            clientSecret: PLUGGY_CLIENT_SECRET
        });
        accessToken = response.data.apiKey;
        return accessToken;
    } catch (error) {
        console.error('Erro ao obter token:', error.response?.data || error.message);
        throw error;
    }
}

// Criar Connect Token (para widget de conexão)
app.post('/api/create-connect-token', async (req, res) => {
    try {
        const token = await getAccessToken();
        const response = await axios.post(
            `${PLUGGY_API_URL}/connect_token`,
            {},
            {
                headers: {
                    'X-API-KEY': token
                }
            }
        );
        res.json({ accessToken: response.data.accessToken });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Listar contas conectadas
app.get('/api/items', async (req, res) => {
    try {
        const token = await getAccessToken();
        const response = await axios.get(`${PLUGGY_API_URL}/items`, {
            headers: {
                'X-API-KEY': token
            }
        });
        res.json(response.data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Obter contas bancárias de um item
app.get('/api/accounts/:itemId', async (req, res) => {
    try {
        const token = await getAccessToken();
        const response = await axios.get(
            `${PLUGGY_API_URL}/accounts?itemId=${req.params.itemId}`,
            {
                headers: {
                    'X-API-KEY': token
                }
            }
        );
        res.json(response.data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Obter transações de uma conta
app.get('/api/transactions/:accountId', async (req, res) => {
    try {
        const token = await getAccessToken();
        const { from, to } = req.query;
        const response = await axios.get(
            `${PLUGGY_API_URL}/transactions?accountId=${req.params.accountId}&from=${from}&to=${to}`,
            {
                headers: {
                    'X-API-KEY': token
                }
            }
        );
        res.json(response.data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});
