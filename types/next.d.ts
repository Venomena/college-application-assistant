import { NextApiRequest } from 'next';
import { File } from 'formidable';

declare module 'next' {
  interface NextApiRequest {
    file?: Express.Multer.File;
    files?: { [fieldname: string]: Express.Multer.File[] };
  }
}
