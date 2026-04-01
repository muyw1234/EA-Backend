import { NextFunction, Request, Response } from 'express';
import UsuarioService from '../services/Usuario';

const createUsuario = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const savedUsuario = await UsuarioService.createUsuario(req.body);
        return res.status(201).json(savedUsuario);
    } catch (error) {
        return res.status(500).json({ error });
    }
};

const readUsuario = async (req: Request, res: Response, next: NextFunction) => {
    const usuarioId = req.params.usuarioId;

    try {
        const usuario = await UsuarioService.getUsuario(usuarioId);
        return usuario ? res.status(200).json(usuario) : res.status(404).json({ message: 'not found' });
    } catch (error) {
        return res.status(500).json({ error });
    }
};

const readAll = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const usuarios = await UsuarioService.getAllUsuarios();
        return res.status(200).json(usuarios);
    } catch (error) {
        return res.status(500).json({ error });
    }
};

const updateUsuario = async (req: Request, res: Response, next: NextFunction) => {
    const usuarioId = req.params.usuarioId;

    try {
        const updatedUsuario = await UsuarioService.updateUsuario(usuarioId, req.body);
        return updatedUsuario ? res.status(201).json(updatedUsuario) : res.status(404).json({ message: 'not found' });
    } catch (error) {
        return res.status(500).json({ error });
    }
};

const deleteUsuario = async (req: Request, res: Response, next: NextFunction) => {
    const usuarioId = req.params.usuarioId;

    try {
        const usuario = await UsuarioService.deleteUsuario(usuarioId);
        return usuario ? res.status(201).json(usuario) : res.status(404).json({ message: 'not found' });
    } catch (error) {
        return res.status(500).json({ error });
    }
};

export default { createUsuario, readUsuario, readAll, updateUsuario, deleteUsuario };