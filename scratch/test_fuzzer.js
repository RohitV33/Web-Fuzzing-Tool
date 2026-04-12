const { runFuzz } = require('../services/fuzzerEngine');

const config = {
  targetUrl: 'http://testfire.net/login.jsp',
  scanMode: 'vuln'
};

const signal = { aborted: false };

console.log('Starting scan test...');

runFuzz(
  config,
  (res) => console.log('Result:', res.url, '| Status:', res.status, '| Vuln:', res.vulnerability?.type),
  ({ progress, stats }) => console.log('Progress:', progress, '% | Stats:', stats),
  signal
).then(stats => {
  console.log('Scan Complete!', stats);
  process.exit(0);
}).catch(err => {
  console.error('Scan Failed:', err);
  process.exit(1);
});
