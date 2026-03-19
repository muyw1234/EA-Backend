import express from 'express';
import controller from '../controllers/Autor';
import { Schemas, ValidateJoi } from '../middleware/Joi';

const router = express.Router();

/**
 * @openapi
 * tags:
 *   - name: Autores
 *     description: Endpoints CRUD de autores
 * components:
 *   schemas:
 *     Autor:
 *       type: object
 *       description: Representa un autor en la base de datos
 *       properties:
 *         _id:
 *           type: string
 *           description: ObjectId de MongoDB
 *           example: "65f1c2a1b2c3d4e5f6789012"
 *         name:
 *           type: string
 *           description: Nombre del autor
 *           example: "Robert C. Martin"
 *         isDeleted:
 *           type: boolean
 *           description: Indica si el autor ha sido eliminado lógicamente
 *           example: false
 *     AutorCreateUpdate:
 *       type: object
 *       description: Datos necesarios para crear o actualizar un autor
 *       required:
 *         - name
 *       properties:
 *         name:
 *           type: string
 *           description: Nombre del autor
 *           example: "Robert C. Martin"
 *         isDeleted:
 *           type: boolean
 *           description: Indica si el autor ha sido eliminado lógicamente
 *           example: false
 */

/**
 * @openapi
 * /autores:
 *   post:
 *     summary: Crear un autor
 *     description: Crea un nuevo autor en la base de datos.
 *     tags:
 *       - Autores
 *     requestBody:
 *       required: true
 *       description: Datos del autor a crear
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/AutorCreateUpdate'
 *     responses:
 *       201:
 *         description: Autor creado correctamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Autor'
 *       422:
 *         description: Error de validación en los datos enviados
 */
router.post('/', ValidateJoi(Schemas.Autor.create), controller.createAutor);

/**
 * @openapi
 * /autores/all:
 *   get:
 *     summary: Listar todos los autores
 *     description: Recupera la lista completa de autores registrados.
 *     tags:
 *       - Autores
 *     responses:
 *       200:
 *         description: Lista de autores obtenida correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Autor'
 */
router.get('/all', controller.getAllAutores);

/**
 * @openapi
 * /autores/{autorId}:
 *   get:
 *     summary: Obtener un autor por ID
 *     description: Recupera la información de un autor a partir de su identificador.
 *     tags:
 *       - Autores
 *     parameters:
 *       - in: path
 *         name: autorId
 *         required: true
 *         description: ID del autor en MongoDB
 *         schema:
 *           type: string
 *           example: "65f1c2a1b2c3d4e5f6789012"
 *     responses:
 *       200:
 *         description: Autor obtenido correctamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Autor'
 *       404:
 *         description: Autor no encontrado
 */
router.get('/:autorId', controller.getAutor);

/**
 * @openapi
 * /autores:
 *   get:
 *     summary: Listar autores no eliminados
 *     description: Recupera la lista de autores que no han sido eliminados lógicamente.
 *     tags:
 *       - Autores
 *     responses:
 *       200:
 *         description: Lista de autores obtenida correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Autor'
 */
router.get('/', controller.getAllAutores_NOT_Deleted);

/**
 * @openapi
 * /autores/{autorId}:
 *   put:
 *     summary: Actualizar un autor por ID
 *     description: Actualiza los datos de un autor existente a partir de su identificador.
 *     tags:
 *       - Autores
 *     parameters:
 *       - in: path
 *         name: autorId
 *         required: true
 *         description: ID del autor en MongoDB
 *         schema:
 *           type: string
 *           example: "65f1c2a1b2c3d4e5f6789012"
 *     requestBody:
 *       required: true
 *       description: Datos del autor a actualizar
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/AutorCreateUpdate'
 *     responses:
 *       200:
 *         description: Autor actualizado correctamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Autor'
 *       404:
 *         description: Autor no encontrado
 */
router.put('/:autorId', ValidateJoi(Schemas.Autor.update), controller.updateAutor);

/**
 * @openapi
 * /autores/{autorId}:
 *   delete:
 *     summary: Eliminar un autor por ID
 *     description: Elimina un autor existente a partir de su identificador.
 *     tags:
 *       - Autores
 *     parameters:
 *       - in: path
 *         name: autorId
 *         required: true
 *         description: ID del autor en MongoDB
 *         schema:
 *           type: string
 *           example: "65f1c2a1b2c3d4e5f6789012"
 *     responses:
 *       200:
 *         description: Autor eliminado correctamente
 *       404:
 *         description: Autor no encontrado
 */
router.delete('/:autorId', controller.deleteAutor);

export default router;
