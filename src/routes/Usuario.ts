import express from 'express';
import controller from '../controllers/Usuario';
import { Schemas, ValidateJoi } from '../middleware/Joi';

const router = express.Router();

/**
 * @openapi
 * tags:
 *   - name: Usuarios
 *     description: Endpoints CRUD de usuarios
 * components:
 *   schemas:
 *     Usuario:
 *       type: object
 *       description: Representa un usuario en la base de datos
 *       properties:
 *         _id:
 *           type: string
 *           description: ObjectId de MongoDB
 *           example: "65f1c2a1b2c3d4e5f6789012"
 *         name:
 *           type: string
 *           description: Nombre del usuario
 *           example: "Judit"
 *         email:
 *           type: string
 *           description: Correo electrónico del usuario
 *           example: "judit@gmail.com"
 *         password:
 *           type: string
 *           description: Contraseña del usuario
 *           example: "password123"
 *         libros:
 *           type: array
 *           description: Lista de IDs de libros asociados al usuario
 *           items:
 *             type: string
 *           example:
 *             - "65f1c2a1b2c3d4e5f6789012"
 *             - "65f1c2a1b2c3d4e5f6789013"
 *         IsDeleted:
 *           type: boolean
 *           description: Indica si el usuario ha sido eliminado lógicamente
 *           example: false
 *     UsuarioCreateUpdate:
 *       type: object
 *       description: Datos necesarios para crear o actualizar un usuario
 *       required:
 *         - name
 *         - email
 *         - password
 *       properties:
 *         name:
 *           type: string
 *           description: Nombre del usuario
 *           example: "User X"
 *         email:
 *           type: string
 *           description: Correo electrónico del usuario
 *           example: "uX@gmail.com"
 *         password:
 *           type: string
 *           description: Contraseña del usuario
 *           example: "123456789"
 *         libros:
 *           type: array
 *           description: Lista de IDs de libros asociados al usuario
 *           items:
 *             type: string
 *           example:
 *             - "65f1c2a1b2c3d4e5f6789012"
 *             - "65f1c2a1b2c3d4e5f6789013"
 *         IsDeleted:
 *           type: boolean
 *           description: Indica si el usuario ha sido eliminado lógicamente
 *           example: false
 */

/**
 * @openapi
 * /usuarios:
 *   post:
 *     summary: Crear un usuario
 *     description: Crea un nuevo usuario en la base de datos.
 *     tags:
 *       - Usuarios
 *     requestBody:
 *       required: true
 *       description: Datos del usuario a crear
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UsuarioCreateUpdate'
 *     responses:
 *       201:
 *         description: Usuario creado correctamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Usuario'
 *       422:
 *         description: Error de validación en los datos enviados
 */
router.post('/', ValidateJoi(Schemas.usuario.create), controller.createUsuario);

/**
 * @openapi
 * /usuarios/all:
 *   get:
 *     summary: Listar todos los usuarios
 *     description: Recupera la lista completa de usuarios registrados.
 *     tags:
 *       - Usuarios
 *     responses:
 *       200:
 *         description: Lista de usuarios obtenida correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Usuario'
 */
router.get('/all', controller.getAllUsuarios);

/**
 * @openapi
 * /usuarios/{usuarioId}:
 *   get:
 *     summary: Obtener un usuario por ID
 *     description: Recupera la información de un usuario a partir de su identificador.
 *     tags:
 *       - Usuarios
 *     parameters:
 *       - in: path
 *         name: usuarioId
 *         required: true
 *         description: ID del usuario en MongoDB
 *         schema:
 *           type: string
 *           example: "65f1c2a1b2c3d4e5f6789012"
 *     responses:
 *       200:
 *         description: Usuario obtenido correctamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Usuario'
 *       404:
 *         description: Usuario no encontrado
 */
router.get('/:usuarioId', controller.getUsuario);

/**
 * @openapi
 * /usuarios:
 *   get:
 *     summary: Listar usuarios no eliminados
 *     description: Recupera la lista de usuarios que no han sido eliminados lógicamente.
 *     tags:
 *       - Usuarios
 *     responses:
 *       200:
 *         description: Lista de usuarios obtenida correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Usuario'
 */
router.get('/', controller.getAllUsuarios_NOT_Deleted);

/**
 * @openapi
 * /usuarios/{usuarioId}:
 *   put:
 *     summary: Actualizar un usuario por ID
 *     description: Actualiza los datos de un usuario existente a partir de su identificador.
 *     tags:
 *       - Usuarios
 *     parameters:
 *       - in: path
 *         name: usuarioId
 *         required: true
 *         description: ID del usuario en MongoDB
 *         schema:
 *           type: string
 *           example: "65f1c2a1b2c3d4e5f6789012"
 *     requestBody:
 *       required: true
 *       description: Datos del usuario a actualizar
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UsuarioCreateUpdate'
 *     responses:
 *       200:
 *         description: Usuario actualizado correctamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Usuario'
 *       404:
 *         description: Usuario no encontrado
 *       422:
 *         description: Error de validación en los datos enviados
 */
router.put('/:usuarioId', ValidateJoi(Schemas.usuario.update), controller.updateUsuario);

/**
 * @openapi
 * /usuarios/{usuarioId}:
 *   delete:
 *     summary: Eliminar un usuario por ID
 *     description: Elimina un usuario existente a partir de su identificador.
 *     tags:
 *       - Usuarios
 *     parameters:
 *       - in: path
 *         name: usuarioId
 *         required: true
 *         description: ID del usuario en MongoDB
 *         schema:
 *           type: string
 *           example: "65f1c2a1b2c3d4e5f6789012"
 *     responses:
 *       200:
 *         description: Usuario eliminado correctamente
 *       404:
 *         description: Usuario no encontrado
 */
router.delete('/:usuarioId', controller.deleteUsuario);

/**
 * @openapi
 * /usuarios/restore/{usuarioId}:
 *    put:
 *     summary: Recuperar un usuario desactivado
 *     description: Cambia el estado IsDeleted a false para que el usuario vuelva a estar operativo.
 *     tags: [Usuarios]
 *     parameters:
 *       - in: path
 *         name: usuarioId
 *         required: true
 *         schema:
 *           type: string
 *         description: ObjectId del usuario a recuperar
 *     responses:
 *       200:
 *         description: Usuario restaurado con éxito
 *       404:
 *         description: No se encontró el usuario
 */
router.put('/restore/:usuarioId', controller.restoreUsuario);

export default router;
