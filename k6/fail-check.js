import http from 'k6/http';
import { check, sleep } from 'k6';

const BASE_URL = 'http://localhost:3000';

export const options = {
  vus: 3,
  duration: '10s',
  thresholds: {
    
    checks: ['rate==1.0'],
  },
};

export default function () {
  const res = http.get(`${BASE_URL}/`);

  check(res, {
    'status é 201 (vai falhar em um GET comum)': (r) => r.status === 201,
    'body contém texto inexistente': (r) =>
      r.body && r.body.includes('TEXTO_QUE_NAO_EXISTE_NA_RESPOSTA'),
  });

  sleep(1);
}