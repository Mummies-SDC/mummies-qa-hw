import http from 'k6/http';
import { sleep } from 'k6';
import { baseline, smallDrop, smallSale, bigSale, bigDrop, independent } from './scenarios.js';

export const options = {
  thresholds: {
    http_req_failed: ['rate<0.01'],
    http_req_duration: ['p(99)<2000'],
  },
  // scenarios: baseline
  // scenarios: smallDrop
  // scenarios: smallSale
  scenarios: independent
  // scenarios: bigSale
  // scenarios: bigDrop
};

const randomProductId = Math.floor(Math.random() * (1000011 - 1) + 1);

export default function () {
  http.get(`http://localhost:3000/qa/questions/${randomProductId}?count=10&page=1`);
  sleep(1);
}
