import { NextFunction, Request, Response } from 'express';
import mongoose from 'mongoose';
import Mensaje from '../models/Mensaje';
import { sendSuccess, sendError } from '../library/ApiResponse';

const createMensaje = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const mensaje = new Mensaje({
            _id: new mongoose.Types.ObjectId(),
            ...req.body
        });
        const savedMensaje = await mensaje.save();
        return sendSuccess(res, savedMensaje, 'Mensaje enviado con éxito', 201);
    } catch (error) {
        return sendError(res, error, 'No se pudo enviar el mensaje');
    }
};

const getMensajesByChat = async (req: Request, res: Response, next: NextFunction) => {
    const chatId = req.params.chatId;
    try {
        const mensajes = await Mensaje.find({ chat: chatId }).populate('sender');
        return sendSuccess(res, mensajes, `Mensajes del chat recuperados con éxito`);
    } catch (error) {
        return sendError(res, error, 'Error al recuperar los mensajes del chat');
    }
};

export default { createMensaje, getMensajesByChat };
