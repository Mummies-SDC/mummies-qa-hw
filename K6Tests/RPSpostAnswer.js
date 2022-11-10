import http from 'k6/http';
import { sleep } from 'k6';
import { baseline, independent, smallDrop, smallSale, bigSale, bigDrop } from './scenarios.js';

export const options = {
  thresholds: {
    http_req_failed: ['rate<0.01'],
    http_req_duration: ['p(99)<2000'],
  },
  // scenarios: baseline
  // scenarios: smallDrop
  // scenarios: smallSale
  // scenarios: bigSale
  // scenarios: bigDrop
  scenarios: independent
};

export default function () {

  const data = {
    "body": "Can I post a answer?",
    "name": "HUCCI",
    "email": "hucci@gmail.com",
    "photos": ["https://unsplash.com/photos/Won79_9oUEk",
    "https://unsplash.com/photos/-iJgjj33eEk",
    "https://unsplash.com/photos/QZGQO3NvsLo"]
  };

  const randomProductId = Math.floor(Math.random() * (3518963 - 1) + 1);

  const URL = `http://localhost:3000/qa/answer/${randomProductId}`;
  let res = http.post(URL, JSON.stringify(data), {
    headers: { 'Content-Type': 'application/json' },
  });
  sleep(1);
}
