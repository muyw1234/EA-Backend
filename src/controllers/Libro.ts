import { NextFunction, Request, Response } from 'express';
import mongoose from 'mongoose';
import LibroService from '../services/Libro';
import Logging from '../library/Logging';
import { getPaginationParams } from './Pagination';
import { sendSuccess, sendError } from '../library/ApiResponse';

const createLibro = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const savedLibro = await LibroService.createLibro(req.body);
        return sendSuccess(res, savedLibro, 'Libro creado', 201);
    } catch (error) {
        return sendError(res, error, 'No se pudo crear el libro');
    }
};

const getLibro = async (req: Request, res: Response, next: NextFunction) => {
    const libroId = req.params.libroId;
    try {
        const libro = await LibroService.getLibro(libroId);
        if (!libro) {
            return sendError(res, 'El libro solicitado no existe en la base de datos', 'Not Found', 404);
        }
        return sendSuccess(res, libro, 'Libro obtenido con éxito');
    } catch (error) {
        return sendError(res, error, 'Error al procesar la búsqueda del libro');
    }
};

const getAllLibros = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { page, limit } = getPaginationParams(req);
        const libros = await LibroService.getAllLibros(page, limit);
        return sendSuccess(res, libros, 'Libros obtenidos con éxito');
    } catch (error) {
        return sendError(res, error, 'Error al recuperar el listado de libros');
    }
};

const getAllLibros_NOT_Deleted = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { page, limit } = getPaginationParams(req);
        const libros = await LibroService.getAllLibros_NOT_Deleted(page, limit);
        return sendSuccess(res, libros, 'Libros activos obtenidos con éxito');
    } catch (error) {
        return sendError(res, error, 'Error al recuperar los libros activos');
    }
};

const getLibrosByType = async (req: Request, res: Response, next: NextFunction) => {
    const type = req.params.type;
    try {
        const libros = await LibroService.getLibrosByType(type);
        return sendSuccess(res, libros, `Libros de tipo '${type}' obtenidos con éxito`);
    } catch (error) {
        return sendError(res, error, `Error al recuperar los libros de tipo: ${type}`);
    }
};

const updateLibro = async (req: Request, res: Response, next: NextFunction) => {
    const libroId = req.params.libroId;
    try {
        const libro = await LibroService.updateLibro(libroId, req.body);
        if (!libro) {
            return sendError(res, 'No se encontró el libro solicitado para actualizar', 'Not Found', 404);
        }
        return sendSuccess(res, libro, 'Libro actualizado con éxito');
    } catch (error) {
        return sendError(res, error, 'Error al intentar actualizar el libro');
    }
};

const deleteLibro = async (req: Request, res: Response, next: NextFunction) => {
    const libroId = req.params.libroId;
    try {
        const libro = await LibroService.deleteLibro(libroId);
        if (!libro) {
            return sendError(res, 'No se encontró el libro solicitado para eliminar', 'Not Found', 404);
        }
        return sendSuccess(res, libro, 'Libro eliminado con éxito', 200);
    } catch (error) {
        return sendError(res, error, 'Error al intentar eliminar el libro');
    }
};

const restoreLibro = async (req: Request, res: Response, next: NextFunction) => {
    const libroId = req.params.libroId;
    try {
        const libro = await LibroService.restoreLibro(libroId);
        if (!libro) return sendError(res, 'No se encontró el libro para restaurar', 'Not Found', 404);

        return sendSuccess(res, libro, 'Libro restaurado con éxito');
    } catch (error) {
        return sendError(res, error, 'Error al restaurar el libro');
    }
};
/** Para testing */
export async function createLibroByIsbn(req: Request, res: Response, next: NextFunction) {
    const isbn = req.params.isbn;

    try {
        const libro = await LibroService.getLibroByIsbn(isbn);
        Logging.info(`Book found: ${libro}`);
        if (libro !== null) return sendSuccess(res, libro, 'El libro ya existía en la base de datos');

        const libroSaved = await LibroService.createLibroByIsbn(isbn);
        return sendSuccess(res, libroSaved, 'Libro creado mediante ISBN con éxito', 201);
    } catch (error) {
        return sendError(res, error, 'Error crítico al gestionar el libro por ISBN');
    }
}

async function searchLibroByTitle(req: Request, res: Response, next: NextFunction) {
    const { page, limit } = getPaginationParams(req);
    const term: string = req.query.term as string;
    Logging.info(`Searching the term: ${term}`);

    try {
        const libros = await LibroService.searchLibroByTitle(term, page, limit);
        if (libros.length === 0) {
            return sendError(res, `No se encontraron coincidencias para el término: ${term}`, 'Not Found', 404);
        }
        return sendSuccess(res, libros, 'Búsqueda procesada con resultados');
    } catch (error) {
        return sendError(res, error, 'Error al procesar la búsqueda por título');
    }
}

export default { createLibro, getLibro, getAllLibros, getAllLibros_NOT_Deleted, getLibrosByType, updateLibro, deleteLibro, restoreLibro, createLibroByIsbn, searchLibroByTitle };
