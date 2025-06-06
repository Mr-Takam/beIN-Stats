import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  stages: [
    { duration: '30s', target: 20 }, // Montée en charge progressive
    { duration: '1m', target: 20 },  // Charge constante
    { duration: '30s', target: 0 },  // Dégradation progressive
  ],
  thresholds: {
    http_req_duration: ['p(95)<500'], // 95% des requêtes doivent être inférieures à 500ms
    http_req_failed: ['rate<0.01'],   // Taux d'erreur inférieur à 1%
  },
};

export default function () {
  const BASE_URL = 'http://app:80';
  
  // Test de la page d'accueil
  const homeResponse = http.get(`${BASE_URL}/`);
  check(homeResponse, {
    'status is 200': (r) => r.status === 200,
    'response time < 500ms': (r) => r.timings.duration < 500,
  });

  // Test de l'API proxy
  const apiResponse = http.get(`${BASE_URL}/api/competitions`);
  check(apiResponse, {
    'status is 200': (r) => r.status === 200,
    'response time < 500ms': (r) => r.timings.duration < 500,
  });

  sleep(1);
} 