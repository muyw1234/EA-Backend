import mongoose, { Document, Schema } from 'mongoose';
import bcrypt from 'bcrypt';

export interface IUsuario {
    name: string;
    email: string;
    password: string;
}

export interface IUsuarioModel extends IUsuario, Document {
    comparePassword(candidatePassword: string): Promise<boolean>;
}

const UsuarioSchema: Schema = new Schema(
    {
        name: { type: String, required: true },
        email: { type: String, required: true, unique: true },
        password: { type: String, required: true, select: false }
    },
    {
        timestamps: true,
        versionKey: false
    }
);

UsuarioSchema.pre('save', async function (next) {
    const usuario = this as IUsuarioModel;

    if (!usuario.isModified('password')) {
        return next();
    }

    try {
        usuario.password = await bcrypt.hash(usuario.password, 10);
        next();
    } catch (error) {
        next(error as Error);
    }
});

UsuarioSchema.methods.comparePassword = async function (candidatePassword: string): Promise<boolean> {
    return bcrypt.compare(candidatePassword, this.password);
};

export default mongoose.model<IUsuarioModel>('Usuario', UsuarioSchema);