const http = require('node:http');
const calculaTaxaDesconto = require('../calculaDesconto');

const PORT = process.env.PORT || 3000;

function sendJson(res, statusCode, payload) {
  res.writeHead(statusCode, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify(payload));
}

const server = http.createServer((req, res) => {
  if (req.method === 'GET' && req.url === '/health') {
    return sendJson(res, 200, { status: 'ok' });
  }

  if (req.method === 'POST' && req.url === '/desconto') {
    let body = '';

    req.on('data', (chunk) => {
      body += chunk;
    });

    req.on('end', () => {
      try {
        const dados = JSON.parse(body);
        const { primeiraCompra, tipoCliente, valorCompra } = dados;

        if (
          typeof primeiraCompra !== 'boolean' ||
          typeof tipoCliente !== 'string' ||
          typeof valorCompra !== 'number' ||
          !Number.isFinite(valorCompra) ||
          valorCompra < 0
        ) {
          return sendJson(res, 400, {
            erro: 'Parâmetros inválidos. Esperado: primeiraCompra (boolean), tipoCliente (string), valorCompra (number >= 0).'
          });
        }

        const desconto = calculaTaxaDesconto(primeiraCompra, tipoCliente, valorCompra);
        return sendJson(res, 200, { desconto });
      } catch (err) {
        return sendJson(res, 400, { erro: 'JSON inválido na requisição.' });
      }
    });

    return;
  }

  return sendJson(res, 404, { erro: 'Rota não encontrada.' });
});

server.listen(PORT, () => {
  console.log(`Servidor de desconto rodando em http://localhost:${PORT}`);
});