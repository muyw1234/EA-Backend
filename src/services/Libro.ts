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

export async function getLibro(id: string): Promise<ILibro | null> {
    return await Libro.findById(id).populate('authors', 'fullName');
}

export async function getAllLibros(): Promise<ILibro[] | []> {
    return await Libro.find().populate('authors', 'fullName');
}

export async function getAllLibros_NOT_Deleted(): Promise<ILibro[] | []> {
    return await Libro.find({ IsDeleted: false }).populate('authors', 'fullName');
}

export async function updateLibro(id: string, data: ILibro): Promise<ILibro | null> {
    return await Libro.findByIdAndUpdate(id, { title: data.title, authors: data.authors, isbn: data.isbn });
}

export async function deleteLibro(id: string): Promise<ILibro | null> {
    return await Libro.findByIdAndDelete(id);
}

export default { createLibro, createLibroByIsbn, getLibro, getAllLibros, getAllLibros_NOT_Deleted, updateLibro, deleteLibro };
