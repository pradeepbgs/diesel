import http from "http";
import { TrieRouter } from "../../src/router/trie";
import { FindMyWayRouter } from "../../src/router/find-my-way";
import { TrieRouter2 } from "../../src/router/trie2";
// const router = new TrieRouter();
// const router = new FindMyWayRouter()
const router = new TrieRouter2()
// Add routes...
router.add('GET','/api/user/:id', () => "hello world!" as any)
http.createServer((req, res) => {
  const match = router.find(req.method!, req.url || "/");
  if (!match) {
    res.writeHead(404);
    return res.end("Not found");
  }
  res.end(match.handler({} as any));
}).listen(3000, () => console.log("Server running on 3000"));
