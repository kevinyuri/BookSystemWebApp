import { Injectable } from '@angular/core';
import { IAuthor, IBook, IGenre } from '../interfaces';
import * as Parse from 'parse';

@Injectable({
  providedIn: 'root',
})
export class BookDataService {
  private book: IBook[] = [];

  async setBook() {
    try {
      const query = new Parse.Query('Book');
      const categorias = await query.find();

      // Iterar sobre as categorias e buscar os gêneros relacionados
      this.book = await Promise.all(
        categorias.map(async (b: any) => {
          const authorRelation = b.relation('author');
          const authorsQuery = authorRelation.query();
          const authors = await authorsQuery.find();

          return {
            id: b.id,
            title: b.get('title'),
            description: b.get('description'),
            category: b.get('category'),
            author: authors.map((g: any) => ({
              id: g.id,
              name: g.get('name'),
            })),
          };
        })
      );
    } catch (e) {
      console.log('Erro ao buscar categoria:', e);
    }
  }

  getBook() {
    return this.book;
  }

  async addBook(book: IBook) {
    try {
      const BookObject = Parse.Object.extend('Book');
      const newBook = new BookObject();

      // Define as propriedades do livro
      newBook.set('title', book.title);
      newBook.set('description', book.description);

      const CategoryObject = Parse.Object.extend('BookCategory');
      const categoryPointer = new CategoryObject();
      categoryPointer.id = book.category.id;
      newBook.set('category', categoryPointer);

      const AuthorObject = Parse.Object.extend('Author');
      const relation = newBook.relation('author');
      // Associa os autores ao livro
      book.author.forEach((author: IAuthor) => {
        const authorToAdd = new AuthorObject();
        authorToAdd.id = author.id;
        relation.add(authorToAdd);
      });

      // Salva o novo livro com os autores associados
      const result = await newBook.save();
      console.log('Livro adicionado com sucesso:', result);
    } catch (e) {
      console.error('Erro ao adicionar livro:', e);
    }
  }

  async updateBook(book: IBook) {
    try {
      const BookObject = Parse.Object.extend('Book');
      const query = new Parse.Query(BookObject);

      // Busca o livro existente pelo ID
      const bookToUpdate = await query.get(book.id!);

      // Atualiza os campos de título e descrição
      bookToUpdate.set('title', book.title);
      bookToUpdate.set('description', book.description);

      // Atualiza a categoria como Pointer
      const CategoryObject = Parse.Object.extend('BookCategory');
      const categoryPointer = new CategoryObject();
      categoryPointer.id = book.category.id;
      bookToUpdate.set('category', categoryPointer);
      // Atualiza a relação de autores
      const AuthorObject = Parse.Object.extend('Author');
      const authorRelation = bookToUpdate.relation('author');

      // Remove os autores antigos e adiciona os novos
      const currentAuthors = await authorRelation.query().find();
      currentAuthors.forEach((author: any) => {
        authorRelation.remove(author);
      });

      // Adiciona os novos autores
      book.author.forEach((author: IAuthor) => {
        const authorToAdd = new AuthorObject();
        authorToAdd.id = author.id;
        authorRelation.add(authorToAdd);
      });

      const result = await bookToUpdate.save();
      console.log('Livro atualizado com sucesso:', result);
    } catch (e) {
      console.error('Erro ao atualizar livro:', e);
    }
  }

  async deleteBook(bookId: string) {
    try {
      const BookObject = Parse.Object.extend('Book');
      const query = new Parse.Query(BookObject);

      // Busca o livro existente pelo ID
      const bookToDelete = await query.get(bookId);

      // Deleta o livro
      await bookToDelete.destroy();

      console.log('Livro deletado com sucesso');
    } catch (e) {
      console.error('Erro ao deletar livro:', e);
    }
  }
}
