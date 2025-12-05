# Vídeo Passo a Passo do Backend
https://youtu.be/beLpCTjyyNU


# Backend da Concessionária --- Guia de Execução e Testes

Este documento contém o passo a passo completo para rodar o backend do
projeto e testar todas as rotas (CRUD) usando o Thunder Client no VS
Code.

------------------------------------------------------------------------

## 🚀 1. Baixe os Arquivos

Baixe o repositório do projeto (via ZIP ou Git Clone) e extraia em seu
computador.

------------------------------------------------------------------------

## 🧩 2. Abra o VS Code e Acesse o Terminal

No VS Code, abra o terminal integrado:

-   Menu: **Terminal \> New Terminal**
-   Atalho: **Ctrl + \`**

------------------------------------------------------------------------

## 📁 3. Navegue até a Pasta do Backend

No terminal, execute:

``` bash
cd backend
```

Isso irá colocar você dentro da pasta onde está o servidor.

------------------------------------------------------------------------

## 📦 4. Instale as Dependências

Rode:

``` bash
npm install
```

Esse comando vai baixar todas as bibliotecas necessárias para o backend
funcionar.

------------------------------------------------------------------------

## ▶️ 5. Inicie o Servidor

Para iniciar o backend:

``` bash
npm start
```

O servidor será iniciado normalmente em:

    http://localhost:3000

Se aparecer a mensagem no terminal, deu tudo certo:

    SERVIDOR RODANDO EM http://localhost:3000

------------------------------------------------------------------------

# 🔥 6. Testando as Rotas no Thunder Client (CRUD)

Com o servidor rodando, abra o **Thunder Client** no VS Code.

Você poderá testar:

-   **GET** → Buscar dados\
-   **POST** → Criar dados\
-   **PUT** → Atualizar dados\
-   **DELETE** → Remover dados

------------------------------------------------------------------------

## 📘 GET --- Listar todos os veículos

Selecione **GET** e coloque a seguinte URL:

    http://localhost:3000/api/veiculos

Clique em **Send** → Deve retornar uma lista de veículos.

------------------------------------------------------------------------

## ➕ POST --- Criar um novo veículo

1.  Selecione **POST**
2.  URL:

```{=html}
<!-- -->
```
    http://localhost:3000/api/veiculos

3.  Vá até a aba **Body**
4.  Escolha **JSON**
5.  Cole o modelo abaixo:

``` json
{
  "modelo": "",
  "marca": "",
  "ano": ,
  "preco": ,
  "descricao": ""
}
```

Preencha os campos com os valores desejados.

Exemplo:

``` json
{
  "modelo": "Civic LX",
  "marca": "Honda",
  "ano": 2020,
  "preco": 105000,
  "descricao": "Sedã completo"
}
```

Clique em **Send** → Deve retornar o veículo criado.

------------------------------------------------------------------------

## 🛠 PUT --- Atualizar um veículo existente

1.  Escolha **PUT**
2.  Coloque a URL seguindo o ID que deseja alterar:

```{=html}
<!-- -->
```
    http://localhost:3000/api/veiculos/:id

Exemplo:

    http://localhost:3000/api/veiculos/13

3.  No corpo da requisição (**Body → JSON**), use o modelo:

``` json
{
  "modelo": "",
  "marca": "",
  "ano": ,
  "preco": ,
  "descricao": ""
}
```

Basta preencher com os novos valores.

Clique em **Send** → O veículo será atualizado.

------------------------------------------------------------------------

## ❌ DELETE --- Excluir um veículo

1.  Selecione **DELETE**
2.  Informe o ID que deseja remover na URL:

```{=html}
<!-- -->
```
    http://localhost:3000/api/veiculos/:id

Exemplo:

    http://localhost:3000/api/veiculos/6

Clique em **Send** → O registro será deletado.

------------------------------------------------------------------------

## ✔️ Conclusão

Agora você já consegue rodar o backend e testar todas as rotas via
Thunder Client.
