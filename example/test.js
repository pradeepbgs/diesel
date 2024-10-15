import http from 'k6/http';
import { check } from 'k6';

// Define the test options
export let options = {
  stages: [
    { duration: '30s', target: 500 },   // Ramp up to 500 users in 30 seconds
    { duration: '30s', target: 1000 },  // Ramp up to 1,000 users in the next 30 seconds
    { duration: '30s', target: 1500 },  // Ramp up to 2,000 users in the following 30 seconds
    { duration: '1m', target: 1000 },    // Hold at 2,000 users for 1 minute
    { duration: '30s', target: 0 },      // Gradually scale down to 0 users
  ],
  thresholds: {
    http_req_duration: ['p(95)<500'],   // 95% of requests should complete in under 500ms
    http_req_failed: ['rate<0.01'],     // Less than 1% of requests should fail
  },
};

export default function () {
  // Make a GET request to your API endpoint
  let res = http.get('http://localhost:3000/');
  
  // Check if the response status is 200
  check(res, {
    'status is 200': (r) => r.status === 200,
  });
}
