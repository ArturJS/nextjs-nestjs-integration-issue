import { Backend } from '../../backend/src/main';
import { NextApiRequest, NextApiResponse } from 'next';
import httpProxyMiddleware from 'next-http-proxy-middleware';

Backend.init();

export default function graphqlHandler(req: NextApiRequest, res: NextApiResponse) {
  const {
    hostname,
    port
  } = new URL(req.url, `http://${req.headers.host}`);
  const backendPort = Number(port) + 1;
  const targetUrl = `http://${hostname}:${backendPort}/api/graphql`

  return httpProxyMiddleware(req, res, {
    target: targetUrl
  });
}
