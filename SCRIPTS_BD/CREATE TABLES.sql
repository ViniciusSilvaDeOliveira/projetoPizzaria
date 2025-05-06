USE pedidos_node;


CREATE TABLE clientes(
	id INTEGER NOT NULL PRIMARY KEY AUTO_INCREMENT,
    nome VARCHAR(255) NOT NULL,
    cep VARCHAR(50)NOT NULL,
    logradouro VARCHAR(255) NOT NULL,
    numero varchar(50),
    bairro VARCHAR(255) NOT NULL,
    complemento VARCHAR(255) NOT NULL,
    cidade VARCHAR(255) NOT NULL,
    uf VARCHAR(255) NOT NULL,
    telefone VARCHAR(255) NOT NULL,
    ativo bit(1) not NULL DEFAULT(1)
);


CREATE TABLE produtos(
	id INTEGER NOT NULL PRIMARY KEY AUTO_INCREMENT,
    nome VARCHAR(255) NOT NULL,
    ingredientes varchar(500),
    imagem varchar(255),
    preco decimal(10,2) NOT NULL,
    ativo bit(1) not null default(1)
);

CREATE TABLE pedidos(
	id INTEGER NOT NULL PRIMARY KEY AUTO_INCREMENT,
	idCliente INTEGER NOT NULL REFERENCES cliente(id),
	status varchar(255) NOT NULL,
    formaDePagamento varchar(255) NOT NULL,
    dataPedido DATETIME NOT NULL DEFAULT(CURRENT_TIMESTAMP),
    dataEntrega DATETIME,
    ativo bit(1) not null default(1)
);


CREATE TABLE pedidos_produtos(
	id INTEGER NOT NULL PRIMARY KEY AUTO_INCREMENT,
    idPedido INTEGER NOT NULL REFERENCES pedidos(id),
	idProduto INTEGER NOT NULL REFERENCES produtos(id),
    qtde INTEGER NOT NULL,
    ativo bit(1) not null default(1)
);
