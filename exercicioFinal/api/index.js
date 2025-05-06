
const express = require("express");
const cors = require("cors");
const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

var mysql = require('mysql');

//Conexao com o banco de dados;
const connection = mysql.createConnection({
    host:'localhost',
    user:'root',
    password: '12345678',
    database:'pedidos_node',
    port: 3306,
    typeCast: function (field, next) {
        if (field.type === 'BIT' && field.length === 1) {
          const bytes = field.buffer();
          return bytes ? bytes[0] === 1 : false;
        }
        return next();
    }
})

connection.connect((err) =>{
    if(err){
        console.error('Erro ao conectar ao banco de dados' + err)
        return;
    }
    console.log('Conectado ao banco de dados MySql')
});

//QUERY NO BANCO DE DADOS
app.post('/clientes/listar', (req, res) =>{
    const { nome, ativo } = req.body;
    const query = 'SELECT * FROM clientes' + ` WHERE nome LIKE '%${nome}%' ${ativo === ""? `` : `AND ativo = ${ativo}`}`;

    //Executa a consulta
    connection.query(query, (err, results) =>{
        if(err){
            console.log('Erro ao executar a consulta: ', err);
            res.status(500).json({erro : 'Erro ao obter clientes: ' + err});
            return;
        }

        //Envia os resultado como JSON
        res.json({
            clientes: results.map((cliente) =>({
                id: cliente.id,
                nome: cliente.nome,
                cep: cliente.cep,
                logradouro: cliente.logradouro,
                numero: cliente.numero,
                bairro: cliente.bairro,
                complemento : cliente.complemento,
                cidade: cliente.cidade,
                uf: cliente.uf,
                telefone: cliente.telefone,
                ativo: cliente.ativo
            }))
        });
        
        //Exibe os dados dos produtos no console
        console.log('Cliente extraídos do banco de dados:');
        results.forEach((cliente) => {
            console.log(`Cliente: ${cliente}`)
        });
    })
})

app.post('/clientes/inserir', (req, res) =>{
    const { nome, cep, logradouro, numero, bairro, complemento, cidade, uf, telefone, ativo } = req.body;
    let query = 'INSERT INTO clientes(nome, cep, logradouro, numero, bairro, complemento, cidade, uf, telefone, ativo)';
    query += ` VALUES('${nome}','${cep}','${logradouro}','${numero}','${bairro}','${complemento}','${cidade}','${uf}','${telefone}', ${ativo})`
    
    //Executa a consulta
    connection.query(query, (err, results) =>{
        if(err){
            console.log('Erro ao executar a inserção: ', err);
            res.status(500).json({erro : 'Erro ao inserir clientes: ' + err + ` QUERY: ${query}`});
            return;
        }

        //Envia os resultado como JSON
        res.json({ message: "Cliente inserido!" });
        return true;
    })
})

app.post('/clientes/atualizar', (req, res) =>{
    const { id,nome, cep, logradouro, numero, bairro, complemento, cidade, uf, telefone, ativo } = req.body;
    let query = 'UPDATE clientes';
    query += ` SET nome = '${nome}', cep = '${cep}',logradouro = '${logradouro}',numero = '${numero}',bairro = '${bairro}', complemento = '${complemento}',cidade = '${cidade}',uf = '${uf}',telefone = '${telefone}',ativo = ${ativo}`
    query += ` WHERE id = ${id}`
    //Executa a consulta
    connection.query(query, (err, results) =>{
        if(err){
            console.log('Erro ao executar a inserção: ', err);
            res.status(500).json({erro : 'Erro ao inserir clientes: ' + err});
            return false;
        }

        res.json({ message: "Cliente atualizado!" });
        //Envia os resultado como JSON
        return true;
    })
})

app.delete("/clientes/desativar/:id", (req, res) => {
    const id = req.params.id;

    let query = 'UPDATE clientes';
    query += ` SET ativo = 0`
    query += ` WHERE id = ${id}`
    //Executa a consulta
    connection.query(query, (err, results) =>{
        if(err){
            console.log('Erro ao executar a desativação: ', err);
            res.status(500).json({erro : 'Erro ao desativar cliente: ' + err});
            return false;
        }

        res.json({ message: "Cliente excluído!" });
        //Envia os resultado como JSON
        return true;
    })
});

app.post('/produtos/listar', (req, res) =>{
    const { nome, ativo } = req.body;
       const query = 'SELECT * FROM produtos' + ` WHERE nome LIKE '%${nome}%' ${ativo === ""? `` : `AND ativo = ${ativo}`}`;

    //Executa a consulta
    connection.query(query, (err, results) =>{
        if(err){
            console.log('Erro ao executar a consulta: ', err);
            res.status(500).json({erro : 'Erro ao obter produtos: ' + err});
            return;
        }

        //Envia os resultado como JSON
        res.json({
            produtos: results.map((produto) =>({
                id: produto.id,
                nome: produto.nome,
                ingredientes: produto.ingredientes,
                preco : produto.preco,
                imagem: produto.imagem,
                ativo: produto.ativo
            }))
        });
        
        //Exibe os dados dos produtos no console
        console.log('Produto extraídos do banco de dados:');
        results.forEach((produto) => {
            console.log(`Produto: ${produto}`)
        });
    })

});


app.post('/produtos/inserir', (req, res) =>{
    const { nome, ingredientes, imagem, preco, ativo} = req.body;
    let query = 'INSERT INTO produtos(nome, ingredientes, imagem, preco, ativo)';
    query += ` VALUES('${nome}','${ingredientes}','${imagem}',CONVERT('${preco}', DECIMAL(10,2)), ${ativo})`
    
    //Executa a consulta
    connection.query(query, (err, results) =>{
        if(err){
            console.log('Erro ao executar a inserção: ', err);
            res.status(500).json({erro : 'Erro ao inserir produto: ' + err + ` QUERY: ${query}`});
            return;
        }

        //Envia os resultado como JSON
        res.json({id:results.insertId, message: "Produto inserido!" });
        return true;
    })
})


app.post('/produtos/atualizar', (req, res) =>{
    const { id,nome, ingredientes, imagem, preco, ativo} = req.body;
    let query = 'UPDATE produtos';
    query += ` SET nome = '${nome}', ingredientes = '${ingredientes}',imagem = '${imagem}',preco = CONVERT('${preco}', DECIMAL(10,2)),ativo = ${ativo}`
    query += ` WHERE id = ${id}`
    //Executa a consulta
    connection.query(query, (err, results) =>{
        if(err){
            console.log('Erro ao executar a inserção: ', err);
            res.status(500).json({erro : 'Erro ao atualizar produto: ' + err});
            return false;
        }

        res.json({ message: "Produto atualizado!" });
        //Envia os resultado como JSON
        return true;
    })
})

app.delete("/produtos/desativar/:id", (req, res) => {
    const id = req.params.id;

    let query = 'UPDATE produtos';
    query += ` SET ativo = 0`
    query += ` WHERE id = ${id}`
    //Executa a consulta
    connection.query(query, (err, results) =>{
        if(err){
            console.log('Erro ao executar a desativação: ', err);
            res.status(500).json({erro : 'Erro ao desativar produto: ' + err});
            return false;
        }

        res.json({ message: "Produto excluído!" });
        //Envia os resultado como JSON
        return true;
    })
});

















app.post('/pedidos/listar', (req, res) =>{
    const {nomeCliente, ativo } = req.body;
       const query = 'SELECT PP.id, PP.idCliente, C.nome as nomeCliente, PP.status, PP.formaDePagamento, PP.dataPedido, PP.dataEntrega, PP.ativo FROM pedidos PP  INNER JOIN clientes C ON PP.idCliente = C.id ' + ` WHERE  C.nome LIKE '%${nomeCliente}%' ${ativo === ""? `` : `AND PP.ativo = ${ativo}`}`;

    //Executa a consulta
    connection.query(query, (err, results) =>{
        if(err){
            console.log('Erro ao executar a consulta: ', err);
            res.status(500).json({erro : 'Erro ao obter pedidos: ' + err});
            return;
        }

        //Envia os resultado como JSON
        res.json({
            pedidos: results.map((pedido) =>({
                id: pedido.id,
                idCliente: pedido.idCliente,
                nomeCliente: pedido.nomeCliente,
                status: pedido.status,
                formaDePagamento : pedido.formaDePagamento,
                dataEntrega: pedido.dataEntrega,
                dataPedido: pedido.dataPedido,
                ativo: pedido.ativo
            }))
        });
        
        //Exibe os dados dos produtos no console
        console.log('Pedidos extraídos do banco de dados:');
        results.forEach((pedido) => {
            console.log(`Pedido: ${pedido}`)
        });
    })

});


app.post('/pedidos/inserir', (req, res) =>{
    const {idCliente, status, formaDePagamento, dataEntrega, ativo} = req.body;
    let query = 'INSERT INTO pedidos(idCliente, status, formaDePagamento, dataEntrega, ativo)';
    query += ` VALUES(${idCliente},'${status}','${formaDePagamento}', dataEntrega = ${dataEntrega == ''? 'NULL' :  `'` + dataEntrega.toString() + `'`}, ${ativo})`
    
    //Executa a consulta
    connection.query(query, (err, results) =>{
        if(err){
            console.log('Erro ao executar a inserção: ', err);
            res.status(500).json({erro : 'Erro ao inserir pedido: ' + err + ` QUERY: ${query}`});
            return;
        }

        //Envia os resultado como JSON
        res.json({id:results.insertId});
        return true;
    })
})


app.post('/pedidos/atualizar', (req, res) =>{
    const { id,idCliente, status, formaDePagamento, dataEntrega, ativo} = req.body;
    let query = 'UPDATE pedidos';
    query += ` SET idCliente = ${idCliente}, status = '${status}', formaDePagamento = '${formaDePagamento}', dataEntrega = ${dataEntrega == ''? 'NULL' :  `'` + dataEntrega.toString() + `'`} ,ativo = ${ativo}`
    query += ` WHERE id = ${id}`
    //Executa a consulta
    connection.query(query, (err, results) =>{
        if(err){
            console.log('Erro ao executar a inserção: ', err);
            res.status(500).json({erro : 'Erro ao atualizar pedido: ' + err});
            return false;
        }

        res.json({ message: "Pedido atualizado!" });
        //Envia os resultado como JSON
        return true;
    })
})

app.delete("/pedidos/desativar/:id", (req, res) => {
    const id = req.params.id;

    let query = 'UPDATE pedidos';
    query += ` SET ativo = 0`
    query += ` WHERE id = ${id}`
    //Executa a consulta
    connection.query(query, (err, results) =>{
        if(err){
            console.log('Erro ao executar a desativação: ', err);
            res.status(500).json({erro : 'Erro ao desativar pedido: ' + err});
            return false;
        }

        res.json({ message: "Pedido excluído!" });
        //Envia os resultado como JSON
        return true;
    })
});



app.post('/pedidos/produtos/listar/:idPedido', (req, res) =>{
    const idPedido = req.params.idPedido;
       const query = 'SELECT PP.id, PP.idPedido, PP.idProduto, P.nome as nomeProduto, P.imagem, P.ingredientes, P.preco as precoProduto, PP.qtde, PP.ativo FROM pedidos_produtos PP INNER JOIN produtos P ON P.id = PP.idProduto' + ` WHERE PP.ativo = 1  AND PP.idPedido = ${idPedido}`;

    //Executa a consulta
    connection.query(query, (err, results) =>{
        if(err){
            console.log('Erro ao executar a consulta: ', err);
            res.status(500).json({erro : 'Erro ao obter produtos do pedido: ' + err});
            return;
        }

        //Envia os resultado como JSON
        res.json({
            pedidos_produtos: results.map((pedido_produto) =>({
                id: pedido_produto.id,
                idPedido: pedido_produto.idPedido,
                idProduto: pedido_produto.idProduto,
                nomeProduto: pedido_produto.nomeProduto,
                precoProduto: pedido_produto.precoProduto,
                imagemProduto: pedido_produto.imagem,
                ingredientesProduto: pedido_produto.ingredientes,
                qtde : pedido_produto.qtde,
                ativo: pedido_produto.ativo
            }))
        });
        
        //Exibe os dados dos produtos no console
        console.log('Produtos do pedido extraídos do banco de dados:');
        results.forEach((pedido_produto) => {
            console.log(`Pedido: ${pedido_produto}`)
        });
    })

});


app.post('/pedidos/produtos/inserir', (req, res) =>{
    const {idPedido, idProduto, qtde} = req.body;

    let query = 'INSERT INTO pedidos_produtos(idPedido, idProduto, qtde, ativo)';
    query += ` VALUES(${idPedido}, ${idProduto} , ${qtde}, ${1})`;
    
    //Executa a consulta
    connection.query(query, (err, results) =>{
        if(err){
            console.log('Erro ao executar a inserção: ', err);
            res.status(500).json({erro : 'Erro ao inserir produto no pedido: ' + err + ` QUERY: ${query}`});
            return;
        }

        //Envia os resultado como JSON
        res.json({ message: "Produto inserido no pedido!" });
        return true;
    })
})



app.delete("/pedidos/produtos/desativar/:idPedido", (req, res) => {
    const idPedido = req.params.idPedido;

    let query = 'UPDATE pedidos_produtos';
    query += ` SET ativo = 0`
    query += ` WHERE idPedido = ${idPedido}`
    //Executa a consulta
    connection.query(query, (err, results) =>{
        if(err){
            console.log('Erro ao executar a desativação: ', err);
            res.status(500).json({erro : 'Erro ao desativar algum produto do pedido: ' + err});
            return false;
        }

        res.json({ message: "Produto removido!" });
        //Envia os resultado como JSON
        return true;
    })
});

// Simula uma base de dados de cartões de crédito
const cartoes = [
    { id: 1, numero: '1234-5678-9012-3456', saldo: 1000, limite: 2000 },
    { id: 2, numero: '9876-5432-1098-7654', saldo: 500, limite: 1500 },
  ];
  
  // Função para verificar se uma compra é aprovada
  function aprovarCompra(cartao, valor) {
    if (cartao.saldo + valor <= cartao.limite) {
      cartao.saldo += valor;
      return true;
    } else {
      return false;
    }
  }
  
  // Endpoint para realizar uma compra
  app.post('/cartao/compras', (req, res) => {
    const { numeroCartao, valor } = req.body;
    const cartao = cartoes.find((c) => c.numero === numeroCartao);
    if (!cartao) {
      res.status(404).json({ mensagem: 'Cartão não encontrado' });
    } else if (aprovarCompra(cartao, valor)) {
      res.json({ mensagem: 'Compra aprovada', valor, saldo: cartao.saldo });
    } else {
      res.status(402).json({ mensagem: 'Compra não aprovada. Limite excedido.' });
    }
  });
  
  // Endpoint para consultar o saldo do cartão
  app.get('/cartao/saldo/:numeroCartao', (req, res) => {
    const { numeroCartao } = req.params;
    const cartao = cartoes.find((c) => c.numero === numeroCartao);
    if (!cartao) {
      res.status(404).json({ mensagem: 'Cartão não encontrado' });
    } else {
      res.json({ saldo: cartao.saldo, limite: cartao.limite });
    }
  });


app.listen(port, () => {
    console.log(`API rodando em http://localhost:${port}`);
});