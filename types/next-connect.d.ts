declare module 'next-connect' {
  import { NextApiRequest, NextApiResponse } from 'next';
  import { RequestHandler } from 'express';
  import { IncomingMessage, ServerResponse } from 'http';

  type NextConnect = <T extends IncomingMessage = NextApiRequest, U extends ServerResponse = NextApiResponse>(
    opts?: {
      onError?: (err: any, req: T, res: U, next: (err?: any) => void) => void;
      onNoMatch?: (req: T, res: U) => void;
    }
  ) => NextConnectInstance<T, U>;

  interface NextConnectInstance<T extends IncomingMessage = NextApiRequest, U extends ServerResponse = NextApiResponse> {
    use(...handlers: Array<RequestHandler<T, U>>): this;
    get(...handlers: Array<RequestHandler<T, U>>): this;
    post(...handlers: Array<RequestHandler<T, U>>): this;
    put(...handlers: Array<RequestHandler<T, U>>): this;
    delete(...handlers: Array<RequestHandler<T, U>>): this;
    patch(...handlers: Array<RequestHandler<T, U>>): this;
    options(...handlers: Array<RequestHandler<T, U>>): this;
    head(...handlers: Array<RequestHandler<T, U>>): this;
    handler(req: T, res: U): void;
  }

  const nextConnect: NextConnect;
  export default nextConnect;
}
