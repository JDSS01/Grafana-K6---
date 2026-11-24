import http from 'k6/http';
import { sleep } from 'k6';

const BASE_URL = 'http://localhost:3000';

export const options = {
  vus: 5,
  duration: '10s',
  thresholds: {
    
    http_req_failed: ['rate<0.01'],
    s
    http_req_duration: ['p(95)<1'],
  },
};

export default function () {
  http.get(`${BASE_URL}/rota-que-nao-existe`);
  sleep(1);
}