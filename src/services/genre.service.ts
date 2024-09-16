import { Injectable } from '@angular/core';
import { IGenre } from '../interfaces';
import * as Parse from 'parse';

@Injectable({
  providedIn: 'root',
})
export class GenreDataService {
  private genre: IGenre[] = [];

  async setGenre() {
    try {
      const query = new Parse.Query('BookGenre');
      const generos = await query.find();
      this.genre = generos.map((g) => ({
        id: g.id,
        name: g.get('name'),
      }));
      console.log(this.genre);
    } catch (e) {
      console.log('Erro ao buscar genero:', e);
    }
  }

  getGenre() {
    return this.genre;
  }

  async addGenre(genre: IGenre) {
    try {
      const GenreObject = Parse.Object.extend('BookGenre');
      const newGenre = new GenreObject();
      newGenre.set('name', genre.name);

      const result = await newGenre.save();
      console.log(result);
    } catch (e) {
      console.error('Erro ao adicionar gênero:', e);
    }
  }

  async updateGenre(genre: IGenre) {
    try {
      const query = new Parse.Query('BookGenre');
      const genreToUpdate = await query.get(genre.id!);

      if (genreToUpdate) {
        genreToUpdate.set('name', genre.name);
        const updatedGenre = await genreToUpdate.save();
        console.log('Gênero atualizado com sucesso:', updatedGenre);
      }
    } catch (e) {
      console.error('Erro ao atualizar gênero:', e);
    }
  }

  async deleteGenre(id: string) {
    try {
      const query = new Parse.Query('BookGenre');
      const genreToDelete = await query.get(id);

      if (genreToDelete) {
        await genreToDelete.destroy();
        console.log('Gênero deletado com sucesso');
      }
    } catch (e) {
      console.error('Erro ao deletar gênero:', e);
    }
  }
}
