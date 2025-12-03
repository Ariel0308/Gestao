# Gestao
Backend de uma loja de roupas.

## Pré-requisitos
- Node.js 18+ e npm
- Docker e Docker Compose

## Configuração
1. Instale as dependências:
   ```bash
   npm install
   ```
2. Copie o arquivo `.env.example` para `.env` e ajuste os valores se necessário (`MONGODB_URI` já aponta para o banco local e `PORT=5000`):
   ```bash
   cp .env.example .env
   ```
3. Suba o MongoDB local com Docker Compose:
   ```bash
   docker compose up -d
   ```
4. (Opcional) Popule o banco para ter dados iniciais:
   ```bash
   node popular.js
   ```
5. Inicie a API:
   ```bash
   node api.js
   ```

O servidor ficará disponível em `http://localhost:5000` e utilizará o MongoDB exposto em `mongodb://gestao_root:gestao_secret@localhost:27017/gestao?authSource=admin` (valor padrão do `.env.example`).

## Serviços Docker
O arquivo `docker-compose.yml` provisiona um contêiner `mongo:7.0` com:
- volume persistido em `./docker-data/mongo`
- usuário raiz `gestao_root` e senha `gestao_secret`
- database inicial `gestao`

Certifique-se de que a variável `MONGODB_URI` aponta para `mongodb://gestao_root:gestao_secret@localhost:27017/gestao?authSource=admin` (valor padrão em `.env.example`) para que a aplicação se conecte ao banco local.

## Popular o banco de dados
O script `popular.js` remove dados antigos e insere categorias, produtos, usuários e movimentos consistentes com os schemas atuais.

1. Garanta que o container Mongo esteja ativo (`docker compose up -d`).
2. Execute:
   ```bash
   node popular.js
   ```
3. Após a execução, teste a API:
   ```bash
   curl http://localhost:5000/api/categories
   ```
