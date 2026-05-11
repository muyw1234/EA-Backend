import express from 'express';
import controller from '../controllers/Evento';
import { Schemas, ValidateJoi } from '../middleware/Joi';

const router = express.Router();

/**
 * @openapi
 * tags:
 *   - name: Eventos
 *     description: Endpoints CRUD de eventos
 *
 * components:
 *   schemas:
 *     Evento:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           description: ObjectId de MongoDB
 *         title:
 *           type: string
 *           example: "Lectura de Clean Code"
 *         description:
 *           type: string
 *           example: "Sesión de lectura y debate del libro"
 *         date:
 *           type: string
 *           format: date-time
 *           example: "2026-03-12T10:00:00.000Z"
 *         libreria:
 *           type: string
 *           description: ID de la librería que aloja el evento
 *           example: "65f1c2a1b2c3d4e5f6789013"
 *     EventoCreateUpdate:
 *       type: object
 *       required:
 *         - title
 *         - description
 *         - date
 *         - libreria
 *       properties:
 *         title:
 *           type: string
 *           example: "Lectura de Clean Code"
 *         description:
 *           type: string
 *           example: "Sesión de lectura y debate del libro"
 *         date:
 *           type: string
 *           format: date-time
 *           example: "2026-03-12T10:00:00.000Z"
 *         libreria:
 *           type: string
 *           example: "65f1c2a1b2c3d4e5f6789013"
 */

/**
 * @openapi
 * /eventos:
 *   post:
 *     summary: Crea un evento
 *     tags: [Eventos]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/EventoCreateUpdate'
 *     responses:
 *       201:
 *         description: Creado
 *       422:
 *         description: Validación fallida
 */
router.post('/', ValidateJoi(Schemas.evento.create), controller.createEvento);

/**
 * @openapi
 * /eventos/{eventoId}:
 *   get:
 *     summary: Obtiene un evento por ID
 *     tags: [Eventos]
 *     parameters:
 *       - in: path
 *         name: eventoId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: OK
 *       404:
 *         description: No encontrado
 */
router.get('/:eventoId', controller.getEvento);

/**
 * @openapi
 * /eventos:
 *   get:
 *     summary: Lista todos los eventos
 *     tags: [Eventos]
 *     parameters:
 *       - in: query
 *         name: page
 *         required: false
 *         description: Numero de pagina a consultar
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *           example: 2
 *       - in: query
 *         name: limit
 *         required: false
 *         description: Cantidad maxima de elementos por pagina
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *           default: 10
 *           example: 3
 *     responses:
 *       200:
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Evento'
 *                 pagination:
 *                   type: object
 *                   properties:
 *                     total:
 *                       type: integer
 *                       example: 25
 *                     page:
 *                       type: integer
 *                       example: 2
 *                     limit:
 *                       type: integer
 *                       example: 3
 *                     totalPages:
 *                       type: integer
 *                       example: 9
 */
router.get('/', controller.getAllEventos);

/**
 * @openapi
 * /eventos/{eventoId}:
 *   put:
 *     summary: Actualiza un evento por ID
 *     tags: [Eventos]
 *     parameters:
 *       - in: path
 *         name: eventoId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/EventoCreateUpdate'
 *     responses:
 *       201:
 *         description: Actualizado
 *       404:
 *         description: No encontrado
 */
router.put('/:eventoId', ValidateJoi(Schemas.evento.update), controller.updateEvento);

/**
 * @openapi
 * /eventos/{eventoId}:
 *   delete:
 *     summary: Elimina un evento por ID
 *     tags: [Eventos]
 *     parameters:
 *       - in: path
 *         name: eventoId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       201:
 *         description: Eliminado
 *       404:
 *         description: No encontrado
 */
router.delete('/:eventoId', controller.deleteEvento);

/**
 * @openapi
 * /eventos/{eventoId}/restore:
 *   post:
 *     summary: Restaura un evento eliminado por ID (soft delete)
 *     tags: [Eventos]
 *     parameters:      
 *       - in: path  
 *         name: eventoId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Restaurado
 *       404:
 *         description: No encontrado
 *       500:
 *         description: Error del servidor
 */
router.post('/:eventoId/restore', controller.restoreEvento);
export default router;
