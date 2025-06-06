import http from 'k6/http';
import { check, sleep } from 'k6';
import { Rate, Trend } from 'k6/metrics';

// Métriques personnalisées
const errorRate = new Rate('errors');
const responseTime = new Trend('response_time');

export const options = {
  scenarios: {
    stress_test: {
      executor: 'ramping-vus',
      startVUs: 0,
      stages: [
        { duration: '2m', target: 50 },  // Montée en charge jusqu'à 50 VUs
        { duration: '5m', target: 50 },  // Maintien à 50 VUs
        { duration: '2m', target: 100 }, // Montée en charge jusqu'à 100 VUs
        { duration: '5m', target: 100 }, // Maintien à 100 VUs
        { duration: '2m', target: 0 },   // Dégradation progressive
      ],
      gracefulRampDown: '30s',
    },
  },
  thresholds: {
    'http_req_duration': ['p(95)<1000'], // 95% des requêtes < 1s
    'http_req_failed': ['rate<0.05'],    // Taux d'erreur < 5%
    'errors': ['rate<0.1'],              // Taux d'erreur personnalisé < 10%
  },
};

const BASE_URL = 'http://app:80';

export default function () {
  // Test de la page d'accueil
  const homeResponse = http.get(`${BASE_URL}/`);
  check(homeResponse, {
    'status is 200': (r) => r.status === 200,
    'response time < 1s': (r) => r.timings.duration < 1000,
  }) || errorRate.add(1);
  responseTime.add(homeResponse.timings.duration);

  // Test de l'API des compétitions
  const competitionsResponse = http.get(`${BASE_URL}/api/competitions`);
  check(competitionsResponse, {
    'status is 200': (r) => r.status === 200,
    'response time < 1s': (r) => r.timings.duration < 1000,
  }) || errorRate.add(1);
  responseTime.add(competitionsResponse.timings.duration);

  // Test de l'API des équipes
  const teamsResponse = http.get(`${BASE_URL}/api/teams`);
  check(teamsResponse, {
    'status is 200': (r) => r.status === 200,
    'response time < 1s': (r) => r.timings.duration < 1000,
  }) || errorRate.add(1);
  responseTime.add(teamsResponse.timings.duration);

  // Test de l'API des matchs
  const matchesResponse = http.get(`${BASE_URL}/api/matches`);
  check(matchesResponse, {
    'status is 200': (r) => r.status === 200,
    'response time < 1s': (r) => r.timings.duration < 1000,
  }) || errorRate.add(1);
  responseTime.add(matchesResponse.timings.duration);

  sleep(1);
} 