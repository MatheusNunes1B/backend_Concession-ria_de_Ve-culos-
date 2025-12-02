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

// ==================== ROTAS ====================

// Rota de teste
app.get('/api/test', (req, res) => {
    res.json({
        success: true,
        message: 'API funcionando!',
        timestamp: new Date().toISOString()
    });
});

// Listar todos os veículos
app.get('/api/veiculos', async (req, res) => {
    try {
        const { data, error } = await supabase
            .from('veiculos')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) throw error;

        res.json({ success: true, total: data.length, data });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Erro ao buscar veículos', error: error.message });
    }
});

// Buscar veículo por ID
app.get('/api/veiculos/:id', async (req, res) => {
    try {
        const { id } = req.params;

        if (isNaN(id)) {
            return res.status(400).json({ success: false, message: "ID inválido" });
        }

        const { data, error } = await supabase
            .from('veiculos')
            .select('*')
            .eq('id', parseInt(id))
            .maybeSingle(); // retorna null se não existir

        if (!data) {
            return res.status(404).json({ success: false, message: "Veículo não encontrado" });
        }

        if (error) throw error;

        res.json({ success: true, data });
    } catch (error) {
        res.status(500).json({ success: false, message: "Erro ao buscar veículo", error: error.message });
    }
});

// Cadastrar veículo
app.post('/api/veiculos', async (req, res) => {
    try {
        const { modelo, marca, ano, preco, descricao } = req.body;

        if (!modelo || !marca || !ano || !preco) {
            return res.status(400).json({
                success: false,
                message: 'Campos obrigatórios: modelo, marca, ano, preco'
            });
        }

        const { data, error } = await supabase
            .from('veiculos')
            .insert([{
                modelo: modelo.trim(),
                marca: marca.trim(),
                ano: parseInt(ano),
                preco: parseFloat(preco),
                descricao: descricao ? descricao.trim() : null,
                updated_at: new Date().toISOString()
            }])
            .select();

        if (error) throw error;

        res.status(201).json({ success: true, message: 'Veículo cadastrado com sucesso!', data: data[0] });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// Atualizar veículo
app.put('/api/veiculos/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { modelo, marca, ano, preco, descricao } = req.body;

        if (isNaN(id)) return res.status(400).json({ success: false, message: "ID inválido" });

        if (!modelo || !marca || !ano || !preco) {
            return res.status(400).json({ success: false, message: 'Campos obrigatórios faltando: modelo, preco, marca, ano' });
        }

        const camposAtualizados = {
            modelo: modelo.trim(),
            marca: marca.trim(),
            ano: parseInt(ano),
            preco: parseFloat(preco),
            descricao: descricao ? descricao.trim() : null,
            updated_at: new Date().toISOString()
        };

        const { data, error } = await supabase
            .from('veiculos')
            .update(camposAtualizados)
            .eq('id', parseInt(id))
            .select();

        if (error) throw error;

        if (!data || data.length === 0) {
            return res.status(404).json({ success: false, message: "Veículo não encontrado" });
        }

        res.json({ success: true, message: "Veículo atualizado com sucesso!", data: data[0] });
    } catch (error) {
        res.status(500).json({ success: false, message: "Erro ao atualizar veículo", error: error.message });
    }
});

// Deletar veículo
app.delete('/api/veiculos/:id', async (req, res) => {
    try {
        const { id } = req.params;

        if (isNaN(id)) return res.status(400).json({ success: false, message: "ID inválido" });

        const { data, error } = await supabase
            .from('veiculos')
            .delete()
            .eq('id', parseInt(id))
            .select();

        if (error) throw error;

        if (!data || data.length === 0) {
            return res.status(404).json({ success: false, message: 'Veículo não encontrado' });
        }

        res.json({ success: true, message: 'Veículo excluído com sucesso!', data: data[0] });
    } catch (error) {
        res.status(500).json({ success: false, message: "Erro ao excluir veículo", error: error.message });
    }
});

// Servir frontend
app.use(express.static('../frontend'));

// Catch-all 404
app.use('*', (req, res) => {
    res.status(404).json({
        success: false,
        message: 'Rota não encontrada',
        routes: [
            'GET /api/test',
            'GET /api/veiculos',
            'GET /api/veiculos/:id',
            'POST /api/veiculos',
            'PUT /api/veiculos/:id',
            'DELETE /api/veiculos/:id'
        ]
    });
});

// Start server
app.listen(PORT, () => {
    console.log('🚗 SERVIDOR CONCESSIONÁRIA RODANDO!');
    console.log(`📡 http://localhost:${PORT}`);
});
