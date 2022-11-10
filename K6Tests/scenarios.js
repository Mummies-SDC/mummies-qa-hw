module.exports = {
  baseline: {
    contacts: {
      executor: 'ramping-vus',
      startVUs: 10,
      stages: [
        { duration: '30s', target: 10 },
      ],
      gracefulRampDown: '60s',
    },
  },
  // INDEPENDENT SCENARIO
  independent: {
    contacts: {
      executor: 'ramping-vus',
      startVUs: 1,
      stages: [
        { duration: '2s', target: 1 },
        { duration: '10s', target: 6000 },
        { duration: '10s', target: 6000 }
      ],
      gracefulRampDown: '60s',
    },
  },
  // SCENARIO 200 VUs 15s (DROP)
  smallDrop: {
    contacts: {
      executor: 'ramping-vus',
      startVUs: 1,
      stages: [
        { duration: '2s', target: 1 },
        { duration: '2s', target: 200 },
        { duration: '15s', target: 200 },
      ],
      gracefulRampDown: '60s',
    },
  },
  // SCENARIO 800 VUs 10/10/10 (TIMED SALE)
  smallSale: {
    contacts: {
      executor: 'ramping-vus',
      startVUs: 1,
      stages: [
        { duration: '2s', target: 1 },
        { duration: '10s', target: 800 },
        { duration: '10s', target: 800 },
        { duration: '10s', target: 0}
      ],
      gracefulRampDown: '60s',
    },
  },
  // SCENARIO 1000 VUs 10/10/10 (BIG TIMED SALE)
  bigSale: {
    contacts: {
      executor: 'ramping-vus',
      startVUs: 1,
      stages: [
        { duration: '2s', target: 1 },
        { duration: '15s', target: 6750 },
        { duration: '15s', target: 6750 },
        { duration: '15s', target: 0}
      ],
      gracefulRampDown: '60s',
    },
  },

  bigDrop: {
    contacts: {
      executor: 'ramping-vus',
      startVUs: 1,
      stages: [
        { duration: '2s', target: 750 },
        { duration: '15s', target: 1000 },
        { duration: '15s', target: 1000 },
        { duration: '15s', target: 0}
      ],
      gracefulRampDown: '60s',
    },
  }
}