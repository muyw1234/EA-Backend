import mongoose from 'mongoose';
import Valoracion, { IValoracionModel, IValoracion } from '../models/Valoracion';
import Usuario from '../models/Usuario';
import Libro from '../models/Libro';
import Logging from '../library/Logging';

const createValoracion = async (data: Partial<IValoracion>): Promise<IValoracionModel | null> => {
    const { usuarioAutor, usuarioValorado, libro, tipoOperacion } = data;

    // 1. Check self-rating
    if (usuarioAutor === usuarioValorado) {
        throw new Error('No puedes valorarte a ti mismo');
    }

    // 2. Validate transaction
    const user = await Usuario.findById(usuarioAutor);
    if (!user) {
        Logging.error(`Valoracion error: Autor ${usuarioAutor} no encontrado`);
        throw new Error('Usuario autor no encontrado');
    }

    /*
    const opType = tipoOperacion?.toUpperCase();
    const bookList = opType === 'VENTA' ? user.boughtLibros : user.rentedLibros;
    const bookListStrings = bookList.map((id: any) => id.toString());
    
    if (!bookListStrings.includes(libro?.toString() || '')) {
        Logging.error(`Valoracion error: Libro ${libro} no encontrado en la lista de ${opType} del usuario ${usuarioAutor}`);
        throw new Error(`No has ${opType === 'VENTA' ? 'comprado' : 'alquilado'} este libro`);
    }

    // 3. Verify owner
    const book = await Libro.findById(libro);
    if (!book) {
        Logging.error(`Valoracion error: Libro ${libro} no encontrado`);
        throw new Error('Libro no encontrado');
    }
    if (book.owner?.toString() !== usuarioValorado?.toString()) {
        Logging.error(`Valoracion error: El propietario del libro ${book.owner} no coincide con el valorado ${usuarioValorado}`);
        throw new Error('El usuario valorado no es el propietario del libro');
    }
    */

    // 4. Check for existing rating
    const existing = await Valoracion.findOne({ 
        usuarioAutor: new mongoose.Types.ObjectId(usuarioAutor), 
        usuarioValorado: new mongoose.Types.ObjectId(usuarioValorado), 
        libro: new mongoose.Types.ObjectId(libro) 
    });
    if (existing) {
        Logging.error(`Valoracion error: Ya existe una valoración para esta operación`);
        throw new Error('Ya has valorado a este usuario por este libro');
    }

    const valoracion = new Valoracion({
        _id: new mongoose.Types.ObjectId(),
        ...data
    });

    return await valoracion.save();
};

const getValoracionesReceived = async (usuarioId: string): Promise<IValoracionModel[]> => {
    if (!mongoose.Types.ObjectId.isValid(usuarioId)) {
        Logging.warning(`Invalid usuarioId for valoraciones: ${usuarioId}`);
        return [];
    }
    return await Valoracion.find({ usuarioValorado: new mongoose.Types.ObjectId(usuarioId) })
        .populate('usuarioAutor', 'name')
        .populate('libro', 'title')
        .sort({ createdAt: -1 });
};

const getRatingStats = async (usuarioId: string) => {
    if (!mongoose.Types.ObjectId.isValid(usuarioId)) {
        return { averageRating: 0, totalReviews: 0 };
    }
    const stats = await Valoracion.aggregate([
        { $match: { usuarioValorado: new mongoose.Types.ObjectId(usuarioId) } },
        {
            $group: {
                _id: '$usuarioValorado',
                averageRating: { $avg: '$puntuacion' },
                totalReviews: { $sum: 1 }
            }
        }
    ]);

    if (stats.length === 0) {
        return { averageRating: 0, totalReviews: 0 };
    }

    return {
        averageRating: parseFloat(stats[0].averageRating.toFixed(1)),
        totalReviews: stats[0].totalReviews
    };
};

export default { createValoracion, getValoracionesReceived, getRatingStats };
