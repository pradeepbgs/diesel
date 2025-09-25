import * as http from 'node:http'


async function convertNodeReqToWebReq(req: http.IncomingMessage) {
    const url = `http://${req.headers.host}${req.url}`
    const init: RequestInit = {
        method: req.method,
        headers: req.headers as Record<string, string>,
        body: null
    }
    if (req.method !== 'GET' && req.method !== 'PUT') {
        init.body = new ReadableStream({
            start(controller) {
              req.on('data', (chunk) => controller.enqueue(new Uint8Array(chunk)));
              req.on('end', () => controller.close());
              req.on('error', (err) => controller.error(err));
            }
          });
    }
    return new Request(url, init);
}



async function sendWebResToNodeRes(webRes: Response, nodeRes: http.ServerResponse) {
    nodeRes.writeHead(webRes.status, Object.fromEntries(webRes.headers))
    const reader = webRes.body?.getReader()
    if (reader) {
        let result
        while (!(result = await reader.read()).done) {
            nodeRes.write(Buffer.from(result.value))
        }
    }
    nodeRes.end()
}

export function serve(app: any, port = 3000) {
    const server = http.createServer(async (request, response) => {
        const webRequest = await convertNodeReqToWebReq(request);

        // send our req to diesel's fetch handler
        const fetchHandler = app.fetch()
        const webRes = await fetchHandler(webRequest, server as any)

        await sendWebResToNodeRes(webRes, response)
    })

    server.listen(port, () => console.log('node server running on port 3000'))
}


