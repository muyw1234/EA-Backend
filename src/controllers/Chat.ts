import { NextFunction, Request, Response } from 'express';
import mongoose from 'mongoose';
import Chat from '../models/Chat';
// Importamos los helpers compartidos del proyecto
import { sendSuccess, sendError } from '../library/ApiResponse';

const createChat = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const chat = new Chat({
            _id: new mongoose.Types.ObjectId(),
            ...req.body
        });
        const savedChat = await chat.save();
        return sendSuccess(res, savedChat, 'Chat creado con éxito', 201);
    } catch (error) {
        // sendError analizará si faltan participantes o si los ObjectIds están mal estructurados
        return sendError(res, error, 'No se pudo crear el chat');
    }
};

const getChat = async (req: Request, res: Response, next: NextFunction) => {
    const chatId = req.params.chatId;
    try {
        const chat = await Chat.findById(chatId).populate('participants libro');
        if (!chat) {
            return sendError(res, 'El chat solicitado no existe', 'Not Found', 404);
        }
        return sendSuccess(res, chat, 'Chat obtenido con éxito');
    } catch (error) {
        return sendError(res, error, 'Error al procesar la búsqueda del chat');
    }
};

const getAllChats = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const chats = await Chat.find().populate('participants libro');
        return sendSuccess(res, chats, 'Listado de chats obtenido con éxito');
    } catch (error) {
        return sendError(res, error, 'Error al recuperar la lista de chats');
    }
};

const deleteChat = async (req: Request, res: Response, next: NextFunction) => {
    const chatId = req.params.chatId;
    try {
        const chat = await Chat.findByIdAndDelete(chatId);
        if (!chat) {
            return sendError(res, 'No se encontró el chat para eliminar', 'Not Found', 404);
        }
        // Devolvemos el documento que se eliminó en el campo data para mantener el formato
        return sendSuccess(res, chat, 'Chat eliminado permanentemente de la base de datos');
    } catch (error) {
        return sendError(res, error, 'Error al intentar eliminar el chat');
    }
};

export default { createChat, getChat, getAllChats, deleteChat };
