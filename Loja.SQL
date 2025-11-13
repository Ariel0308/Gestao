-- 1. Tabela de Categorias
CREATE TABLE Categoria (
    id_categoria SERIAL PRIMARY KEY,
    nome VARCHAR(100) NOT NULL UNIQUE
);

-- 2. Tabela de Usuários
CREATE TABLE "User" (
    id_user SERIAL PRIMARY KEY,
    nome VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    senha VARCHAR(255) NOT NULL UNIQUE
);

-- 3. Tabela de Produtos
-- Depende de 'Categoria'
CREATE TABLE Produto (
    id_produto SERIAL PRIMARY KEY,
    nome VARCHAR(255) NOT NULL,
    descricao TEXT,
    tamanho VARCHAR(50),
    cor VARCHAR(50),
    preco NUMERIC(10, 2) NOT NULL CHECK (preco >= 0), -- Ex: 12345678.90
    estoque INT NOT NULL DEFAULT 0 CHECK (estoque >= 0),
    
    -- Chave Estrangeira
    id_categoria INT NOT NULL,
    CONSTRAINT fk_categoria
        FOREIGN KEY(id_categoria) 
        REFERENCES Categoria(id_categoria)
);

-- 4. Tabela de Movimentação de Estoque
-- Define um tipo customizado para 'Entrada' ou 'Saida'
CREATE TYPE tipo_movimento AS ENUM ('Entrada', 'Saida');

CREATE TABLE Movimento (
    id_movimento SERIAL PRIMARY KEY,
    tipo tipo_movimento NOT NULL, -- Usa o ENUM 'Entrada' ou 'Saida'
    quantidade INT NOT NULL CHECK (quantidade > 0),
    data_mov TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP, -- Data e hora com fuso
    valor_unitario NUMERIC(10, 2) NOT NULL,
    observacao TEXT,
    
    -- Chaves Estrangeiras
    id_produto INT NOT NULL,
    id_user INT NOT NULL,
    
    CONSTRAINT fk_produto
        FOREIGN KEY(id_produto) 
        REFERENCES Produto(id_produto),
    
    CONSTRAINT fk_user
        FOREIGN KEY(id_user) 
        REFERENCES "User"(id_user)
);