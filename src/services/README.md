# Documentacion

## Libro

`createLibro(data: Partial<ILibro>) : Promise<ILibro|null>` Crea un libro a partir de los datos del libro y devuelve el libro recien creado. `readLibro(id: string) : Promise<ILibro|null>` Obtiene el
libro con ese id, si no lo encuentra entonces devuelve null. `readLibros() : Promise<ILibro[]|[]>` Obtiene todos los libros. `updateLibro(id: string, data: ILibro) : Promise<ILibro|null>` Actualiza el
libro con ese id y pasando los nuevos datos. Devuelve el libro actualizado. `deleteLibro(id: string) : Promise<ILibro|null>` Elimina el libro especificado por ese id y devuelve el libro recien
eliminado. `createLibroByIsbn(isbn: string) : Promise<ILibro|null>` Crea un libro basado en el isbn, los datos los obtenemos de la api de Google. **Aun en desarrollo**
