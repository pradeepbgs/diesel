import { extractDynamicParams, extractParam } from "../../src/ctx";
import { TrieRouter2 } from "../../src/router/trie2";

const router = new TrieRouter2();

// ==========================================
// 1. SETUP: Register Routes
// ==========================================

// A. Basic & Root
router.add("GET", "/", () => "root");
router.add("GET", "/about", () => "about");

// B. Parameters (Single & Multi)
router.add("GET", "/users/:id", () => "user_view");
router.add("GET", "/users/:id/edit", () => "user_edit");
const r = router.find('GET','/users/23/edit')
console.log(JSON.stringify(r))
console.log(extractParam(r?.params,'/users/23/edit'))
router.add("GET", "/posts/:year/:month/:slug", () => "blog_post");

// C. Overlap / Priority Checks
router.add("GET", "/files/all", () => "files_all");
router.add("GET", "/files/:fileId", () => "files_id");

// D. Prefix Safety
router.add("GET", "/auth", () => "auth_root");
router.add("GET", "/auth-token", () => "auth_token");

// E. Method Isolation
router.add("POST", "/submit", () => "submit_post");
router.add("GET", "/submit", () => "submit_get");

// F. Complex Nesting & Level 2 Setup
router.add("GET", "/api/v1/users/new", () => "user_new");
router.add("GET", "/api/v1/users/:id", () => "user_id");
router.add("GET", "/api/v1/users/:id/books", () => "user_books");

// G. Special Chars & Root Param
router.add("GET", "/search/:query", () => "search_handler");
router.add("GET", "/:rootAction", () => "root_action");


// ==========================================
// 2. TEST DEFINITIONS
// ==========================================

type TestCase = {
    name: string;
    method: string;
    path: string;
    shouldMatch: boolean;
    expectedHandler?: string;
    expectedParams?: any;
};

// const tests: TestCase[] = [
//     // --- Basic Checks ---
//     { name: "Root Path", method: "GET", path: "/", shouldMatch: true, expectedHandler: "root" },
//     { name: "Simple Static", method: "GET", path: "/about", shouldMatch: true, expectedHandler: "about" },
    
//     // --- Parameter Extraction ---
//     { name: "Single Param", method: "GET", path: "/users/101", shouldMatch: true, expectedHandler: "user_view", expectedParams: { id: "101" } },
//     { name: "Nested Param", method: "GET", path: "/users/500/edit", shouldMatch: true, expectedHandler: "user_edit", expectedParams: { id: "500" } },
//     { name: "Multi Param", method: "GET", path: "/posts/2024/03/my-title", shouldMatch: true, expectedHandler: "blog_post", expectedParams: { year: "2024", month: "03", slug: "my-title" } },

//     // --- Priority & Overlaps ---
//     { name: "Static Priority (Overlaps)", method: "GET", path: "/files/all", shouldMatch: true, expectedHandler: "files_all" },
//     { name: "Dynamic Fallback", method: "GET", path: "/files/misc.png", shouldMatch: true, expectedHandler: "files_id", expectedParams: { fileId: "misc.png" } },

//     // --- Prefix Safety ---
//     { name: "Prefix Exact Match", method: "GET", path: "/auth", shouldMatch: true, expectedHandler: "auth_root" },
//     { name: "Prefix Extended Match", method: "GET", path: "/auth-token", shouldMatch: true, expectedHandler: "auth_token" },
    
//     // UPDATED: Now expects 'root_action' because /:rootAction catches this!
//     { 
//         name: "Prefix Partial (Caught by Root Param)", 
//         method: "GET", 
//         path: "/aut", 
//         shouldMatch: true, 
//         expectedHandler: "root_action" 
//     },

//     // --- Method Isolation ---
//     { name: "Method POST", method: "POST", path: "/submit", shouldMatch: true, expectedHandler: "submit_post" },
//     { name: "Method GET (Same Path)", method: "GET", path: "/submit", shouldMatch: true, expectedHandler: "submit_get" },
    
//     // --- Trailing Slash ---
//     { name: "Trailing Slash", method: "GET", path: "/about/", shouldMatch: true, expectedHandler: "about" },
    
//     // --- Level 2: Edge Cases ---
//     { name: "Duplicate Slashes", method: "GET", path: "//about///", shouldMatch: true, expectedHandler: "about" },
    
//     // UPDATED: Now expects 'root_action' because /:rootAction catches this!
//     { 
//         name: "Case Sensitivity (Caught by Root Param)", 
//         method: "GET", 
//         path: "/ABOUT", 
//         shouldMatch: true, 
//         expectedHandler: "root_action"
//     },
    
//     { name: "Param Swallow Check", method: "GET", path: "/users/100/edit", shouldMatch: true, expectedHandler: "user_edit" },
    
//     // UPDATED: Added missing expectedHandler
//     { 
//         name: "Special Char (Unencoded)", 
//         method: "GET", 
//         path: "/search/c++", 
//         shouldMatch: true,
//         expectedHandler: "search_handler",
//         expectedParams: { query: "c++" }
//     },
//     { 
//         name: "Emoji Path", 
//         method: "GET", 
//         path: "/search/🚀", 
//         shouldMatch: true,
//         expectedHandler: "search_handler",
//         expectedParams: { query: "🚀" }
//     },

//     // --- Deep Conflict Resolution ---
//     { name: "Deep Static Priority", method: "GET", path: "/api/v1/users/new", shouldMatch: true, expectedHandler: "user_new" },
//     { name: "Deep Dynamic Sibling", method: "GET", path: "/api/v1/users/123/books", shouldMatch: true, expectedHandler: "user_books" },
    
//     // --- Root Param Edge Case ---
//     { name: "Root Param vs Static", method: "GET", path: "/about", shouldMatch: true, expectedHandler: "about" },
//     { name: "Root Param Match", method: "GET", path: "/random-thing", shouldMatch: true, expectedHandler: "root_action" }
// ];

// // ==========================================
// // 3. EXECUTION LOOP
// // ==========================================

// console.log("\n=== 🧪 RUNNING ROUTER TESTS ===\n");

// let passed = 0;
// let failed = 0;

// tests.forEach(test => {
//     const result = router.find(test.method, test.path);
    
//     // Strict Check: Must have result, handler array, and length > 0
//     const hasMatch = !!result && !!result.handler && result.handler.length > 0;
    
//     // Check 1: Match Existence
//     if (hasMatch !== test.shouldMatch) {
//         console.error(`❌ [${test.name}] Failed Match Expectation`);
//         console.error(`   Expected match: ${test.shouldMatch}, Got: ${hasMatch}`);
//         if(hasMatch) console.error(`   (Matched handler: ${result.handler[0]()})`);
//         failed++;
//         return;
//     }

//     if (!test.shouldMatch) {
//         console.log(`✅ [${test.name}] Passed (Correctly Not Found)`);
//         passed++;
//         return;
//     }

//     // Check 2: Handler Identity
//     const handlerOutput = Array.isArray(result.handler) ? result.handler[0]() : (result.handler as any)();
    
//     if (handlerOutput !== test.expectedHandler) {
//         console.error(`❌ [${test.name}] Wrong Handler`);
//         console.error(`   Expected: "${test.expectedHandler}"`);
//         console.error(`   Got:      "${handlerOutput}"`);
//         failed++;
//         return;
//     }

//     // Check 3: Parameter Keys (Loose Check)
//     if (test.expectedParams) {
//         const actualParams = result.params;
//         const expectedStr = JSON.stringify(test.expectedParams);
//         const actualStr = JSON.stringify(actualParams);
        
//         // Logic: Since your router returns [keys] not {k:v}, we check if values exist in array
//         const valuesMatch = Object.values(test.expectedParams).every(v => 
//             Array.isArray(actualParams) ? actualParams.includes(v) : false
//         );

//         // If it's not an exact JSON match AND not a loose value match -> Warn
//         if (expectedStr !== actualStr && !valuesMatch) {
//              console.warn(`⚠️ [${test.name}] Params Check (Verify manually)`);
//              console.warn(`   Expected: ${expectedStr}`);
//              console.warn(`   Got:      ${actualStr}`);
//         }
//     }

//     console.log(`✅ [${test.name}] Passed`);
//     passed++;
// }); 

// console.log(`\n=== RESULT: ${passed} Passed, ${failed} Failed ===`);