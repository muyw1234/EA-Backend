import { NextFunction, Request, Response } from 'express';
import mongoose from 'mongoose';
import UsuarioService from '../services/Usuario';
import Usuario, { IUsuarioModel } from '../models/Usuario';
import jwt from 'jsonwebtoken';
import { config } from '../config/config';
import { IPayload } from '../middleware/verifyToken';
import Logging from '../library/Logging';
import { sendError, sendSuccess } from '../library/ApiResponse';

//#region Autenticacion

export const signup = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user: IUsuarioModel = new Usuario({
            name: req.body.name,
            email: req.body.email,
            password: req.body.password
        });

        // Encriptamos la contraseña antes de guardar
        user.password = await user.encryptPassword(user.password);
        const savedUser = await user.save();

        // Generamos el token de acceso
        const token: string = jwt.sign({ _id: savedUser._id, rol: savedUser.rol }, config.jwt.accessSecret);

        // Adjuntamos la cabecera por compatibilidad y respondemos con sendSuccess
        res.header('auth-token', token);
        return sendSuccess(res, { user: savedUser, token }, 'Usuario registrado con éxito', 201);
    } catch (error: any) {
        Logging.error(`Signup error: ${error}`);
        // sendError ya detecta internamente el código 11000 (Clave duplicada)
        // pero le pasamos un mensaje personalizado para el usuario final
        return sendError(res, error, 'El correo electrónico ya está registrado', 400);
    }
};

export const signin = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user = await UsuarioService.getUsuarioByEmail(req.body.email);
        if (!user) {
            return sendError(res, 'Email or password is wrong', 'Credenciales incorrectas', 400);
        }

        const correctPassword: boolean = await user.validatePassword(req.body.password);
        if (!correctPassword) {
            return sendError(res, 'Incorrect password', 'Credenciales incorrectas', 400);
        }

        const token: string = jwt.sign({ _id: user._id, rol: user.rol } as IPayload, config.jwt.accessSecret, {
            expiresIn: 60 * 15 // 15 minutos
        });

        // Adjuntamos la cabecera por compatibilidad y respondemos con sendSuccess
        res.header('auth-token', token);
        return sendSuccess(res, { user, token }, 'Autenticación exitosa', 200);
    } catch (error) {
        Logging.error(`Signin error: ${error}`);
        return sendError(res, error, 'Error interno durante el inicio de sesión', 500);
    }
};

export const profile = async (req: Request, res: Response, next: NextFunction) => {
    try {
        // Buscamos al usuario por el ID que inyectó el middleware de autenticación
        const usuario = await Usuario.findById(req.userId).populate('libros');

        if (!usuario) {
            return sendError(res, 'Usuario no encontrado', 'El perfil solicitado no existe', 404);
        }

        // Enviamos la respuesta estandarizada
        return sendSuccess(res, usuario, 'Perfil de usuario obtenido con éxito', 200);
    } catch (error) {
        Logging.error(`Profile error: ${error}`);
        return sendError(res, error, 'Error al obtener el perfil del usuario', 500);
    }
};

//#endregion Autenticacion

export default { signup, signin, profile };
