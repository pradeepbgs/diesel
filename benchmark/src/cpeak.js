  import cpeak from "cpeak";

  const server = cpeak();

  server.route("get", "/", (req, res) => {
    res.json({ message: "Hi there!" });
  });

  for (let i = 0; i < 100; i++) {
    server.route("get", `/r${i}`, (req, res) => {
      res.json({ ok: true, route: i });
    });
  }

  server.listen(3000, () => {
    console.log("Server has started on port 3000");
  });
