import { NextFunction, Request, Response } from 'express';
import mongoose from 'mongoose';
import UsuarioService from '../services/Usuario';
import Usuario, { IUsuarioModel } from '../models/Usuario';
import jwt from 'jsonwebtoken';
import { config } from '../config/config';
import { getPaginationParams } from './Pagination';
import Logging from '../library/Logging';
import { sendSuccess, sendError } from '../library/ApiResponse';

const createUsuario = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const savedUsuario = await UsuarioService.createUsuario(req.body);
        return sendSuccess(res, savedUsuario, 'Usuario registrado con éxito', 201);
    } catch (error) {
        return sendError(res, error, 'No se pudo registrar el usuario');
    }
};

const getUsuario = async (req: Request, res: Response, next: NextFunction) => {
    const usuarioId = req.params.usuarioId;
    try {
        const usuario = await UsuarioService.getUsuario(usuarioId);
        if (!usuario) {
            return sendError(res, 'El usuario solicitado no existe', 'Not Found', 404);
        }
        return sendSuccess(res, usuario, 'Usuario obtenido con éxito');
    } catch (error) {
        return sendError(res, error, 'Error al procesar la búsqueda del usuario');
    }
};

const getAllUsuarios = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { page, limit } = getPaginationParams(req);
        const usuarios = await UsuarioService.getAllUsuarios(page, limit);
        return sendSuccess(res, usuarios, 'Listado de usuarios obtenido con éxito');
    } catch (error) {
        return sendError(res, error, 'Error al recuperar la lista de usuarios');
    }
};

const getAllUsuarios_NOT_Deleted = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { page, limit } = getPaginationParams(req);
        const usuarios = await UsuarioService.getAllUsuarios_NOT_Deleted(page, limit);
        return sendSuccess(res, usuarios, 'Listado de usuarios activos obtenido con éxito');
    } catch (error) {
        return sendError(res, error, 'Error al recuperar los usuarios activos');
    }
};

const updateUsuario = async (req: Request, res: Response, next: NextFunction) => {
    const usuarioId = req.params.usuarioId;
    try {
        const updatedUsuario = await UsuarioService.updateUsuario(usuarioId, req.body);
        if (!updatedUsuario) {
            return sendError(res, 'No se encontró el usuario para actualizar', 'Not Found', 404);
        }
        return sendSuccess(res, updatedUsuario, 'Usuario actualizado con éxito');
    } catch (error) {
        return sendError(res, error, 'Error al intentar actualizar el usuario');
    }
};

const deleteUsuario = async (req: Request, res: Response, next: NextFunction) => {
    const usuarioId = req.params.usuarioId;
    try {
        const usuario = await UsuarioService.deleteUsuario(usuarioId);
        if (!usuario) {
            return sendError(res, 'No se encontró el usuario para realizar el borrado lógico', 'Not Found', 404);
        }
        return sendSuccess(res, usuario, 'Usuario desactivado con éxito (borrado lógico)');
    } catch (error) {
        return sendError(res, error, 'Error al intentar desactivar el usuario');
    }
};

const permanentDeleteUsuario = async (req: Request, res: Response, next: NextFunction) => {
    const usuarioId = req.params.usuarioId;
    try {
        const usuario = await UsuarioService.permanentDeleteUsuario(usuarioId);
        if (!usuario) {
            return sendError(res, 'No se encontró el usuario para eliminación física', 'Not Found', 404);
        }
        return sendSuccess(res, null, 'Usuario eliminado permanentemente de la base de datos', 200);
    } catch (error) {
        return sendError(res, error, 'Error al intentar eliminar permanentemente el usuario');
    }
};

const restoreUsuario = async (req: Request, res: Response, next: NextFunction) => {
    const usuarioId = req.params.usuarioId;
    try {
        const usuario = await UsuarioService.restoreUsuario(usuarioId);
        if (!usuario) {
            return sendError(res, 'No se encontró el usuario para restaurar', 'Not Found', 404);
        }
        return sendSuccess(res, usuario, 'Usuario restaurado con éxito');
    } catch (error) {
        return sendError(res, error, 'Error al intentar restaurar el usuario');
    }
};

async function searchUsuarioByName(req: Request, res: Response, next: NextFunction) {
    const { page, limit } = getPaginationParams(req);
    const term: string = req.query.term as string;
    Logging.info(`Searching the term: ${term}`);

    try {
        const usuarios = await UsuarioService.searchUsuarioByName(term, page, limit);
        if (usuarios.length === 0) {
            return sendError(res, `No se encontraron usuarios coincidentes con el término: ${term}`, 'Not Found', 404);
        }
        return sendSuccess(res, usuarios, 'Búsqueda de usuarios realizada con éxito');
    } catch (error) {
        return sendError(res, error, 'Error al procesar la consulta de búsqueda de usuarios');
    }
}

export default { createUsuario, getUsuario, getAllUsuarios, getAllUsuarios_NOT_Deleted, updateUsuario, deleteUsuario, permanentDeleteUsuario, restoreUsuario, searchUsuarioByName };
