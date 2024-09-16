import { Injectable } from '@angular/core';
import { IAuthor } from '../interfaces';
import * as Parse from 'parse';

@Injectable({
  providedIn: 'root',
})
export class AuthorDataService {
  private author: IAuthor[] = [];

  async setAuthor() {
    try {
      const query = new Parse.Query('Author');
      const generos = await query.find();
      this.author = generos.map((a) => ({
        id: a.id,
        name: a.get('name'),
      }));
    } catch (e) {
      console.log('Erro ao buscar autor:', e);
    }
  }

  getAuthor() {
    return this.author;
  }

  async addAuthor(author: IAuthor) {
    try {
      const AuthorObject = Parse.Object.extend('Author');
      const newAuthor = new AuthorObject();
      newAuthor.set('name', author.name);

      const result = await newAuthor.save();
      console.log(result);
    } catch (e) {
      console.error('Erro ao adicionar autor:', e);
    }
  }

  async updateAuthor(author: IAuthor) {
    try {
      const query = new Parse.Query('Author');
      const authorToUpdate = await query.get(author.id!);

      if (authorToUpdate) {
        authorToUpdate.set('name', author.name);
        const updatedAuthor = await authorToUpdate.save();
        console.log('Autor atualizado com sucesso:', updatedAuthor);
      }
    } catch (e) {
      console.error('Erro ao atualizar autor:', e);
    }
  }

  async deleteAuthor(id: string) {
    try {
      const query = new Parse.Query('Author');
      const authorToDelete = await query.get(id);

      if (authorToDelete) {
        await authorToDelete.destroy();
        console.log('Autor deletado com sucesso');
      }
    } catch (e) {
      console.error('Erro ao deletar autor:', e);
    }
  }
}
