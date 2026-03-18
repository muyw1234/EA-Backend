import mongoose from 'mongoose';
import Libro, { ILibroModel, ILibro } from '../models/Libro';
import { callGoogleApi } from './Util';

export async function createLibro(data: Partial<ILibro>): Promise<ILibro | null> {
    const libro = new Libro({
        _id: new mongoose.Types.ObjectId(),
        ...data
    });
    return await libro.save();
}
export async function createLibroByIsbn(isbn: string): Promise<ILibro | null> {
    let data = callGoogleApi(isbn);
    const libro = new Libro({
        _id: new mongoose.Types.ObjectId(),
        ...data
    });
    return await libro.save();
}

export async function readLibro(id: string): Promise<ILibro | null> {
    return await Libro.findById(id);
}

export async function readLibros(id: string): Promise<ILibro[] | []> {
    return await Libro.find();
}

export async function updateLibro(id: string, data: ILibro): Promise<ILibro | null> {
    return await Libro.findByIdAndUpdate(id, { title: data.title, authors: data.authors, isbn: data.isbn });
}

export async function deleteLibro(id: string): Promise<ILibro | null> {
    return await Libro.findByIdAndDelete(id);
}
