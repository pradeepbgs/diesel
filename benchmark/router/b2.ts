import { TrieRouter2 } from "../../src/router/trie2";

// Seed the router with realistic routes
function seedRouter(router) {
  // API v1 routes
  router.add('GET', '/api/v1/users', () => 'list users');
  router.add('GET', '/api/v1/users/:id', () => 'get user');
  router.add('POST', '/api/v1/users', () => 'create user');
  router.add('PUT', '/api/v1/users/:id', () => 'update user');
  router.add('DELETE', '/api/v1/users/:id', () => 'delete user');
  
  // Nested routes
  router.add('GET', '/api/v1/users/:id/posts', () => 'user posts');
  router.add('GET', '/api/v1/users/:id/posts/:postId', () => 'user post detail');
  router.add('GET', '/api/v1/users/:id/posts/:postId/comments', () => 'post comments');
  
  // Products routes
  router.add('GET', '/api/v1/products', () => 'list products');
  router.add('GET', '/api/v1/products/:id', () => 'get product');
  router.add('GET', '/api/v1/products/:category/:id', () => 'product by category');
  
  // API v2 routes
  router.add('GET', '/api/v2/users', () => 'list users v2');
  router.add('GET', '/api/v2/users/:id', () => 'get user v2');
  router.add('GET', '/api/v2/analytics/:metric', () => 'analytics');
  
  // Static routes
  router.add('GET', '/health', () => 'health check');
  router.add('GET', '/status', () => 'status');
  router.add('GET', '/', () => 'home');
  
  // Wildcard routes
  router.add('GET', '/static/*', () => 'static files');
  router.add('GET', '/assets/*', () => 'assets');
  
  // Complex nested params
  router.add('GET', '/api/v1/orgs/:orgId/teams/:teamId/members/:memberId', () => 'nested');
  router.add('POST', '/api/v1/orgs/:orgId/projects/:projectId/tasks', () => 'create task');
  
  // Add some middlewares
  router.addMiddleware('/', [() => 'global middleware']);
  router.addMiddleware('/api/*', [() => 'api middleware']);
  router.addMiddleware('/api/v1/users/*', [() => 'users middleware']);
}

// Test cases covering different scenarios
const testCases = [
  { name: 'Root path', method: 'GET', path: '/' },
  { name: 'Simple static', method: 'GET', path: '/health' },
  { name: 'Single param', method: 'GET', path: '/api/v1/users/123' },
  { name: 'Nested params', method: 'GET', path: '/api/v1/users/123/posts/456' },
  { name: 'Deep nested', method: 'GET', path: '/api/v1/users/123/posts/456/comments' },
  { name: 'Double params', method: 'GET', path: '/api/v1/products/electronics/789' },
  { name: 'Wildcard route', method: 'GET', path: '/static/css/main.css' },
  { name: 'Complex nested', method: 'GET', path: '/api/v1/orgs/org1/teams/team2/members/member3' },
  { name: 'Non-existent', method: 'GET', path: '/api/v1/nonexistent/path' },
];

// Benchmark function
function benchmark(name, fn, iterations) {
  const start = performance.now();
  for (let i = 0; i < iterations; i++) {
    fn();
  }
  const end = performance.now();
  return end - start;
}

// Main test runner
function runBenchmark() {
  console.log('╔════════════════════════════════════════════════════════════╗');
  console.log('║         Router Performance Benchmark (find vs find2)      ║');
  console.log('╚════════════════════════════════════════════════════════════╝\n');

  // Initialize router
  const router = new TrieRouter2();
  seedRouter(router);
  
  const warmupIterations = 100000;
  const testIterations = 5000000;

  console.log(`Warmup iterations: ${warmupIterations.toLocaleString()}`);
  console.log(`Test iterations: ${testIterations.toLocaleString()}\n`);

  // JIT Warmup
  console.log('🔥 Warming up JIT compiler...');
  for (let i = 0; i < warmupIterations; i++) {
    testCases.forEach(tc => {
      router.find(tc.method, tc.path);
      router.find2(tc.method, tc.path);
    });
  }
  console.log('✓ Warmup complete\n');

  // Run benchmarks
  console.log('Running benchmarks...\n');
  const results = [];

  testCases.forEach((testCase, idx) => {
    process.stdout.write(`[${idx + 1}/${testCases.length}] Testing: ${testCase.name}...`);
    
    const findTime = benchmark(
      'find',
      () => router.find(testCase.method, testCase.path),
      testIterations
    );
    
    const find2Time = benchmark(
      'find2',
      () => router.find2(testCase.method, testCase.path),
      testIterations
    );
    
    const diff = findTime - find2Time;
    const improvement = (diff / findTime * 100);
    
    results.push({
      name: testCase.name,
      find: findTime,
      find2: find2Time,
      diff: diff,
      improvement: improvement
    });
    
    console.log(' ✓');
  });

  // Display results
  console.log('\n╔════════════════════════════════════════════════════════════╗');
  console.log('║                     DETAILED RESULTS                       ║');
  console.log('╚════════════════════════════════════════════════════════════╝\n');

  results.forEach((result, idx) => {
    const winner = result.improvement > 0 ? 'find2' : result.improvement < 0 ? 'find' : 'tie';
    const symbol = result.improvement > 0 ? '🟢' : result.improvement < 0 ? '🔴' : '⚪';
    
    console.log(`${symbol} Test ${idx + 1}: ${result.name}`);
    console.log(`   find():  ${result.find.toFixed(2)} ms`);
    console.log(`   find2(): ${result.find2.toFixed(2)} ms`);
    console.log(`   Diff:    ${Math.abs(result.diff).toFixed(2)} ms (${winner} is ${Math.abs(result.improvement).toFixed(2)}% faster)`);
    console.log();
  });

  // Summary statistics
  const avgFind = results.reduce((sum, r) => sum + r.find, 0) / results.length;
  const avgFind2 = results.reduce((sum, r) => sum + r.find2, 0) / results.length;
  const avgImprovement = ((avgFind - avgFind2) / avgFind * 100);
  
  const totalFind = results.reduce((sum, r) => sum + r.find, 0);
  const totalFind2 = results.reduce((sum, r) => sum + r.find2, 0);

  console.log('╔════════════════════════════════════════════════════════════╗');
  console.log('║                         SUMMARY                            ║');
  console.log('╚════════════════════════════════════════════════════════════╝\n');

  console.log(`Average find():  ${avgFind.toFixed(2)} ms`);
  console.log(`Average find2(): ${avgFind2.toFixed(2)} ms`);
  console.log(`Average improvement: ${avgImprovement >= 0 ? '+' : ''}${avgImprovement.toFixed(2)}%\n`);

  console.log(`Total find():  ${totalFind.toFixed(2)} ms`);
  console.log(`Total find2(): ${totalFind2.toFixed(2)} ms`);
  console.log(`Total diff: ${Math.abs(totalFind - totalFind2).toFixed(2)} ms\n`);

  const opsPerSecFind = (testIterations / (avgFind / 1000));
  const opsPerSecFind2 = (testIterations / (avgFind2 / 1000));

  console.log(`Operations/sec (find):  ${opsPerSecFind.toLocaleString(undefined, { maximumFractionDigits: 0 })}`);
  console.log(`Operations/sec (find2): ${opsPerSecFind2.toLocaleString(undefined, { maximumFractionDigits: 0 })}\n`);

  // Determine winner
  const find2Wins = results.filter(r => r.improvement > 0).length;
  const findWins = results.filter(r => r.improvement < 0).length;
  const ties = results.filter(r => Math.abs(r.improvement) < 0.1).length;

  console.log('Win/Loss Record:');
  console.log(`  find2 wins: ${find2Wins}`);
  console.log(`  find wins:  ${findWins}`);
  console.log(`  ties:       ${ties}\n`);

  if (Math.abs(avgImprovement) < 1) {
    console.log('🤝 RESULT: Performance is equivalent (< 1% difference)');
  } else if (avgImprovement > 0) {
    console.log(`🏆 WINNER: find2() is ${avgImprovement.toFixed(2)}% faster on average`);
    console.log('   (using .filter(Boolean) instead of length check)');
  } else {
    console.log(`🏆 WINNER: find() is ${Math.abs(avgImprovement).toFixed(2)}% faster on average`);
    console.log('   (using length check instead of .filter(Boolean))');
  }
  console.log();
}

// Run the benchmark
runBenchmark();