import { required } from 'joi';
import mongoose, { Document, Schema } from 'mongoose';

export interface ILibro {
    isbn: string;
    title: string;
    authors?: mongoose.Types.ObjectId[] | String[]; // Es un array porque claro, un libro puede tener mas de un autor ;el interrogante es por si es anonimo
    //libreria?: mongoose.Types.ObjectId | string;
    IsDeleted?: boolean;
}

export interface ILibroModel extends ILibro, Document {}

const LibroSchema: Schema = new Schema(
    {
        isbn: { type: String, required: true, index: true },
        title: { type: String, required: true },
        authors: [{ type: Schema.Types.ObjectId, required: false, ref: 'Autor' }],
        //type: { type: String, enum: ['VENTA', 'ALQUILER'], required: true },
        //owner: { type: Schema.Types.ObjectId, required: true, ref: 'Usuario' },
        //libreria: { type: Schema.Types.ObjectId, required: false, ref: 'Libreria' }
        IsDeleted: { type: Boolean, default: false }
    },
    {
        timestamps: true,
        versionKey: false
    }
);

export default mongoose.model<ILibroModel>('Libro', LibroSchema);
