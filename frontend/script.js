// ===============================
// ELEMENTOS
// ===============================
const formVeiculo = document.getElementById('form-veiculo');
const btnCadastrar = document.getElementById('btn-cadastrar');
const btnTexto = document.getElementById('btn-texto');
const btnLoading = document.getElementById('btn-loading');

const gridVeiculos = document.getElementById('grid-veiculos');
const listaVazia = document.getElementById('lista-vazia');
const loadingVeiculos = document.getElementById('loading-veiculos');
const contadorVeiculos = document.getElementById('contador-veiculos');
const totalVeiculos = document.getElementById('total-veiculos');

const modalConfirmacao = document.getElementById('modal-confirmacao');
const veiculoNome = document.getElementById('veiculo-nome');
const btnCancelar = document.getElementById('btn-cancelar');
const btnConfirmar = document.getElementById('btn-confirmar');

let veiculoParaExcluir = null;

// ===============================
// FUNÇÃO PARA BUSCAR VEÍCULOS
// ===============================
async function buscarVeiculos() {
    loadingVeiculos.classList.remove('hidden');
    gridVeiculos.classList.add('hidden');
    listaVazia.classList.add('hidden');

    try {
        const res = await fetch('http://localhost:3000/api/veiculos');
        const json = await res.json();

        if (!json.success) throw new Error(json.message);

        const veiculos = json.data;

        if (veiculos.length === 0) {
            listaVazia.classList.remove('hidden');
            contadorVeiculos.classList.add('hidden');
            loadingVeiculos.classList.add('hidden');
            return;
        }

        gridVeiculos.innerHTML = '';
        veiculos.forEach(v => {
            const card = document.createElement('div');
            card.className = 'bg-gray-100 p-4 rounded-lg shadow flex flex-col justify-between';
            card.innerHTML = `
                <div>
                    <h3 class="font-bold text-lg">${v.modelo} (${v.ano})</h3>
                    <p class="text-gray-600">${v.marca}</p>
                    ${v.descricao ? `<p class="text-gray-500 mt-2">${v.descricao}</p>` : ''}
                </div>
                <div class="flex justify-between items-center mt-4">
                    <span class="font-semibold text-car-blue">R$ ${v.preco.toLocaleString()}</span>
                    <button data-id="${v.id}" data-modelo="${v.modelo}" class="bg-car-red text-white px-3 py-1 rounded hover:bg-red-700 btn-excluir">
                        🗑️
                    </button>
                </div>
            `;
            gridVeiculos.appendChild(card);
        });

        // Ativar botões de exclusão
        document.querySelectorAll('.btn-excluir').forEach(btn => {
            btn.addEventListener('click', (e) => {
                veiculoParaExcluir = btn.getAttribute('data-id');
                veiculoNome.textContent = btn.getAttribute('data-modelo');
                modalConfirmacao.classList.remove('hidden');
            });
        });

        totalVeiculos.textContent = veiculos.length;
        contadorVeiculos.classList.remove('hidden');
        gridVeiculos.classList.remove('hidden');

    } catch (err) {
        console.error('Erro ao buscar veículos:', err);
        alert('Erro ao buscar veículos');
    } finally {
        loadingVeiculos.classList.add('hidden');
    }
}

// ===============================
// CADASTRAR VEÍCULO
// ===============================
formVeiculo.addEventListener('submit', async (e) => {
    e.preventDefault();

    btnTexto.classList.add('hidden');
    btnLoading.classList.remove('hidden');
    btnCadastrar.disabled = true;

    const modelo = document.getElementById('modelo').value.trim();
    const marca = document.getElementById('marca').value.trim();
    const ano = parseInt(document.getElementById('ano').value);
    const preco = parseFloat(document.getElementById('preco').value);
    const descricao = document.getElementById('descricao').value.trim();

    try {
        const res = await fetch('http://localhost:3000/api/veiculos', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ modelo, marca, ano, preco, descricao })
        });
        const json = await res.json();

        if (!json.success) throw new Error(json.message);

        formVeiculo.reset();
        buscarVeiculos();
        alert('Veículo cadastrado com sucesso!');

    } catch (err) {
        console.error('Erro ao cadastrar veículo:', err);
        alert(err.message);
    } finally {
        btnTexto.classList.remove('hidden');
        btnLoading.classList.add('hidden');
        btnCadastrar.disabled = false;
    }
});

// ===============================
// CONFIRMAR EXCLUSÃO
// ===============================
btnConfirmar.addEventListener('click', async () => {
    if (!veiculoParaExcluir) return;

    try {
        const res = await fetch(`http://localhost:3000/api/veiculos/${veiculoParaExcluir}`, {
            method: 'DELETE'
        });
        const json = await res.json();

        if (!json.success) throw new Error(json.message);

        alert('Veículo excluído com sucesso!');
        modalConfirmacao.classList.add('hidden');
        veiculoParaExcluir = null;
        buscarVeiculos();

    } catch (err) {
        console.error('Erro ao excluir veículo:', err);
        alert(err.message);
    }
});

// CANCELAR EXCLUSÃO
btnCancelar.addEventListener('click', () => {
    veiculoParaExcluir = null;
    modalConfirmacao.classList.add('hidden');
});

// ===============================
// ATUALIZAR LISTA
// ===============================
document.getElementById('btn-atualizar').addEventListener('click', buscarVeiculos);

// ===============================
// CARREGAR VEÍCULOS AO INICIAR
// ===============================
document.addEventListener('DOMContentLoaded', buscarVeiculos);
