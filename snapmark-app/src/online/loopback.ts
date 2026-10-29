import http from 'node:http';
import type { AddressInfo } from 'node:net';

export interface CallbackRequest {
  method: string;
  host: string;
  url: string;
}
export interface CallbackResponse {
  status: number;
  body: string;
}
export interface Loopback {
  redirectUri: string;
  close(): void;
}

// A temporary OAuth callback only. Repository discovery is never served over HTTP.
export async function listenLoopback(receive: (request: CallbackRequest) => Promise<CallbackResponse>): Promise<Loopback> {
  const server = http.createServer({ maxHeaderSize: 8192, requestTimeout: 5000, headersTimeout: 5000 }, (req, res) => {
    void receive({ method: req.method ?? '', host: req.headers.host ?? '', url: req.url ?? '' })
      .then((answer) => {
        res.writeHead(answer.status, {
          'Content-Type': 'text/plain; charset=utf-8',
          'Cache-Control': 'no-store',
          'Referrer-Policy': 'no-referrer',
          'Content-Security-Policy': "default-src 'none'; frame-ancestors 'none'",
          'X-Content-Type-Options': 'nosniff',
          Connection: 'close',
        });
        res.end(answer.body);
      })
      .catch(() => {
        res.writeHead(400);
        res.end();
      });
  });
  await new Promise<void>((resolve, reject) => {
    server.once('error', reject);
    server.listen(0, '127.0.0.1', resolve);
  });
  const port = (server.address() as AddressInfo).port;
  return {
    redirectUri: `http://127.0.0.1:${port}/callback`,
    close: () => {
      server.close();
      server.closeIdleConnections();
    },
  };
}
