import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  vus: 1,
  duration: '10s',
  thresholds: {
    http_req_failed: ['rate<0.01'],
    http_req_duration: ['p(95)<200'],
    checks: ['rate==1.0'],
  },
};

export default function () {
  const payload = JSON.stringify({
    primeiraCompra: false,
    tipoCliente: 'ouro',
    valorCompra: 100,
  });

  const params = {
    headers: { 'Content-Type': 'application/json' },
  };

  const res = http.post('http://localhost:3000/desconto', payload, params);

  check(res, {
    'status é 200': (r) => r.status === 200,
    'desconto retornado é 15': (r) => r.json('desconto') === 15,
  });

  sleep(1);
}