import crypto from 'crypto';
import { ILibro } from '../models/Libro';

const algorithm = 'md5'; // lo mejor seria ponerlo en .env

export function hash(text: string) {
    return crypto.createHash(algorithm).update(text).digest('hex');
}

export function callGoogleApi(isbn: string): Partial<ILibro> {
    return {}; // aun no esta implementado
}
