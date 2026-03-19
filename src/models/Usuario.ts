import mongoose, { Document, Schema } from 'mongoose';

export interface IUsuario {
    name: string;
    email: string;
    password: string;
    libros: mongoose.Types.ObjectId[] | string[]; // Es un array porque claro, un usuario puede tener mas de un libro
    IsDeleted?: boolean;
}

export interface IUsuarioModel extends IUsuario, Document {}

const UsuarioSchema: Schema = new Schema(
    {
        name: { type: String, required: true },
        email: { type: String, required: true, unique: true },
        password: { type: String, required: true },
        libros: [{ type: Schema.Types.ObjectId, required: false, ref: 'Libro' }],
        IsDeleted: { type: Boolean, default: false }
    },
    {
        timestamps: true,
        versionKey: false
    }
);

export default mongoose.model<IUsuarioModel>('Usuario', UsuarioSchema);
