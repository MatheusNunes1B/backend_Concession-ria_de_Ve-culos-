const express = require('express');
const cors = require('cors');
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error('❌ ERRO: Variáveis do Supabase ausentes no .env');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);
console.log('✅ Conexão com Supabase OK!');

app.get('/api/test', (req, res) => {
    res.json({
        success: true,
        message: 'API funcionando!',
        timestamp: new Date().toISOString()
    });
});

app.get('/api/veiculos', async (req, res) => {
    try {
        console.log('📋 Buscando veículos...');

        const { data, error } = await supabase
            .from('veiculos')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) {
            console.error('❌ Erro ao buscar veículos:', error);
            return res.status(400).json({
                success: false,
                message: 'Erro ao buscar veículos',
                error: error.message
            });
        }

        res.json({
            success: true,
            total: data.length,
            data
        });

    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

app.post('/api/veiculos', async (req, res) => {
    try {
        const { modelo, marca, ano, preco, descricao } = req.body;

        console.log('➕ Cadastrando veículo:', req.body);

        // validações
        if (!modelo || !marca || !ano || !preco) {
            return res.status(400).json({
                success: false,
                message: 'Campos obrigatórios: modelo, marca, ano e preco'
            });
        }

        if (isNaN(preco) || preco <= 0) {
            return res.status(400).json({
                success: false,
                message: 'Preço inválido'
            });
        }

        if (isNaN(ano) || ano < 1950 || ano > 2050) {
            return res.status(400).json({
                success: false,
                message: 'Ano inválido'
            });
        }

        const { data, error } = await supabase
            .from('veiculos')
            .insert([
                {
                    modelo: modelo.trim(),
                    marca: marca.trim(),
                    ano: parseInt(ano),
                    preco: parseFloat(preco),
                    descricao: descricao ? descricao.trim() : null
                }
            ])
            .select();

        if (error) {
            console.error('❌ Erro ao cadastrar veículo:', error);
            return res.status(400).json({
                success: false,
                message: 'Erro ao cadastrar veículo',
                error: error.message
            });
        }

        res.status(201).json({
            success: true,
            message: 'Veículo cadastrado com sucesso!',
            data: data[0]
        });

    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

app.delete('/api/veiculos/:id', async (req, res) => {
    try {
        const { id } = req.params;

        console.log('🗑️ Excluindo veículo ID:', id);

        if (isNaN(id)) {
            return res.status(400).json({
                success: false,
                message: 'ID inválido'
            });
        }

        const { data, error } = await supabase
            .from('veiculos')
            .delete()
            .eq('id', parseInt(id))
            .select();

        if (error) {
            console.error('❌ Erro ao excluir veículo:', error);
            return res.status(400).json({
                success: false,
                message: 'Erro ao excluir veículo',
                error: error.message
            });
        }

        if (data.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Veículo não encontrado'
            });
        }

        res.json({
            success: true,
            message: 'Veículo excluído com sucesso!',
            data: data[0]
        });

    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

app.use(express.static('../frontend'));

app.use('*', (req, res) => {
    res.status(404).json({
        success: false,
        message: 'Rota não encontrada',
        routes: [
            'GET /api/test',
            'GET /api/veiculos',
            'POST /api/veiculos',
            'DELETE /api/veiculos/:id'
        ]
    });
});

app.listen(PORT, () => {
    console.log('🚗 SERVIDOR CONCESSIONÁRIA RODANDO!');
    console.log(`📡 http://localhost:${PORT}`);
});
