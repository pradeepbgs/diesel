import { FastRouter, createServer } from 'velocy'
const app = new FastRouter({
    cache: true,
    performance: {
        enabled: true, // Enable performance tracking
        windowSize: 60000, // 1-minute window for metrics
      },
      enablePooling: true, // Enable object pooling
      poolSize: 100, // Pool size for reusable objects
    
      // Other optimizations
      trustProxy: true, // Trust proxy headers
      mergeParams: true, //
});

// Basic route
app.get("/", (req, res) => {
    res.send("Hello world!");
});

// Dynamic parameters
app.get("/users/:id", (req, res) => {
    res.json({ userId: req.params.id });
});

// Start server
createServer(app).listen(3000, () => {
    console.log("Server running on http://localhost:3000");
});