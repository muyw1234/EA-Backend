const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '../.env') });

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/vivebook_DB';

async function inspectDB() {
    try {
        await mongoose.connect(MONGO_URI);
        console.log('Connected to MongoDB');
        
        const books = await mongoose.connection.db.collection('libros').find({}).toArray();
        console.log(`Total books: ${books.length}`);
        books.forEach(b => console.log(`Book: ${b.title} (${b._id}), owner: ${b.owner}`));
        
        const users = await mongoose.connection.db.collection('usuarios').find({}).toArray();
        console.log(`Total users: ${users.length}`);
        users.forEach(u => console.log(`User: ${u.email} (${u._id}), libros: ${JSON.stringify(u.libros)}`));
        
    } catch (error) {
        console.error('Error inspecting database:', error);
    } finally {
        await mongoose.disconnect();
    }
}

inspectDB();
