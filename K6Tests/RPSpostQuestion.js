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
// product_id, question_body, question_date, asker_name, email
  const randomProductId = Math.floor(Math.random() * (3518963 - 1) + 1);
  const data = {
    "product_id": `${randomProductId}`,
    "body": "Why does my tongue turn blue when I use this?",
    "name": "HUCCI",
    "email": "hucci@gmail.com",
  };

  const URL = `http://localhost:3000/qa/questions`;
  let res = http.post(URL, JSON.stringify(data), {
    headers: { 'Content-Type': 'application/json' },
  });
  sleep(1);
}
