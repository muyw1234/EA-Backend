import { NextFunction, Request, Response } from 'express';
import mongoose from 'mongoose';
import UsuarioService from '../services/Usuario';
import Usuario, { IUsuarioModel } from '../models/Usuario';
import jwt from 'jsonwebtoken';
import { config } from '../config/config';
import { IPayload } from '../middleware/verifyToken';
import Logging from '../library/Logging';

//#region Autenticacion
// Muchas de estos codigos los he sacado del video directamente, no os asusteis si es que no coinciden con los del ejercicio del seminario.
export const signup = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user: IUsuarioModel = new Usuario({
            name: req.body.name,
            email: req.body.email,
            password: req.body.password
        });

        // encriptamos
        user.password = await user.encryptPassword(user.password);

        const savedUser = await user.save();
        const token: string = jwt.sign({ _id: savedUser._id, rol: savedUser.rol }, config.jwt.accessSecret);
        return res.header('auth-token', token).status(201).json({ user: savedUser, token });
    } catch (error: any) {
        Logging.error(`Signup error: ${error}`);
        if (error.code === 11000) {
            return res.status(400).json({ message: 'El correo electrónico ya está registrado' });
        }
        return res.status(500).json({ error: 'Internal Server Error' });
    }
};

export const signin = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user = await UsuarioService.getUsuarioByEmail(req.body.email);
        if (!user) return res.status(400).json('Email or password is wrong');
        const correctPassword: boolean = await user.validatePassword(req.body.password);
        if (!correctPassword) return res.status(400).json('Incorrect password');
        const token: string = jwt.sign({ _id: user._id, rol: user.rol } as IPayload, config.jwt.accessSecret, {
            expiresIn: 60 * 15 // tiempo de expiracion en segundos, pero poniendo config.jwt.expiresIn siempre me da errores
        });
        return res.header('auth-token', token).status(200).json({ user, token });
    } catch (error) {
        Logging.error(`Signin error: ${error}`);
        return res.status(500).json({ error });
    }
};

// retorna la informacion del perfil
export const profile = async (req: Request, res: Response, next: NextFunction) => {
    try {
        if (!req.userId) {
            return res.status(401).json({ message: 'No userId found in request' });
        }

        const usuario = await Usuario.findById(req.userId)
            .populate('libros')
            .populate({
                path: 'boughtLibros',
                populate: { path: 'owner', select: '_id name' }
            })
            .populate({
                path: 'rentedLibros',
                populate: { path: 'owner', select: '_id name' }
            })
            .populate('followingUsers', 'name email');

        if (!usuario) {
            Logging.warning(`Profile requested for non-existent user ID: ${req.userId}`);
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }

        const librosCount = Array.isArray(usuario.libros) ? usuario.libros.length : 0;
        Logging.info(`Profile for ${usuario.email} requested. Books count: ${librosCount}`);
        
        return res.status(200).json(usuario);
    } catch (error: any) {
        Logging.error(`Error in profile controller: ${error}`);
        return res.status(500).json({ 
            message: 'Error al obtener el perfil',
            error: error.message 
        });
    }
};
//#endregion Autenticacion

export default { signup, signin, profile };
