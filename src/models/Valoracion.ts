import mongoose, { Document, Schema } from 'mongoose';

export interface IValoracion {
    usuarioAutor: mongoose.Types.ObjectId | string;
    usuarioValorado: mongoose.Types.ObjectId | string;
    libro: mongoose.Types.ObjectId | string;
    tipoOperacion: 'VENTA' | 'ALQUILER';
    puntuacion: number;
    comentario?: string;
}

export interface IValoracionModel extends IValoracion, Document {}

const ValoracionSchema: Schema = new Schema(
    {
        usuarioAutor: { type: Schema.Types.ObjectId, required: true, ref: 'Usuario' },
        usuarioValorado: { type: Schema.Types.ObjectId, required: true, ref: 'Usuario' },
        libro: { type: Schema.Types.ObjectId, required: true, ref: 'Libro' },
        tipoOperacion: { type: String, enum: ['VENTA', 'ALQUILER'], required: true },
        puntuacion: { type: Number, required: true, min: 1, max: 5 },
        comentario: { type: String, required: false, default: '' }
    },
    {
        timestamps: true,
        versionKey: false
    }
);

// Index to prevent duplicate ratings for the same transaction
ValoracionSchema.index({ usuarioAutor: 1, usuarioValorado: 1, libro: 1 }, { unique: true });

export default mongoose.model<IValoracionModel>('Valoracion', ValoracionSchema);
