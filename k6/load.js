import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  stages: [
    { duration: '10s', target: 20 }, // rampa de subida
    { duration: '20s', target: 20 }, // carga sustentada
    { duration: '10s', target: 0 },  // rampa de descida
  ],
  thresholds: {
    http_req_failed: ['rate<0.01'],
    http_req_duration: ['p(95)<200'],
    checks: ['rate==1.0'],
  },
};

const cenarios = [
  { primeiraCompra: false, tipoCliente: 'bronze', valorCompra: 300, esperado: 5 },
  { primeiraCompra: true, tipoCliente: 'bronze', valorCompra: 350, esperado: 10 },
  { primeiraCompra: false, tipoCliente: 'ouro', valorCompra: 100, esperado: 15 },
  { primeiraCompra: false, tipoCliente: 'n/a', valorCompra: 150, esperado: 0 },
];

export default function () {
  const cenario = cenarios[__ITER % cenarios.length];

  const payload = JSON.stringify({
    primeiraCompra: cenario.primeiraCompra,
    tipoCliente: cenario.tipoCliente,
    valorCompra: cenario.valorCompra,
  });

  const params = {
    headers: { 'Content-Type': 'application/json' },
  };

  const res = http.post('http://localhost:3000/desconto', payload, params);

  check(res, {
    'status é 200': (r) => r.status === 200,
    'desconto corresponde ao cenário': (r) => r.json('desconto') === cenario.esperado,
  });

  sleep(0.5);
}