import { Injectable } from '@angular/core';
import { ICategory, IGenre } from '../interfaces';
import * as Parse from 'parse';

@Injectable({
  providedIn: 'root',
})
export class CategoryDataService {
  private category: ICategory[] = [];

  async setCategory() {
    try {
      const query = new Parse.Query('BookCategory');
      const categorias = await query.find();

      // Iterar sobre as categorias e buscar os gêneros relacionados
      this.category = await Promise.all(
        categorias.map(async (c) => {
          const genresRelation = c.relation('genre');
          const genresQuery = genresRelation.query();
          const genres = await genresQuery.find();

          return {
            id: c.id,
            name: c.get('name'),
            description: c.get('description'),
            genre: genres.map((g) => ({ id: g.id, name: g.get('name') })),
          };
        })
      );
    } catch (e) {
      console.log('Erro ao buscar categoria:', e);
    }
  }

  getCategory() {
    return this.category;
  }

  async addCategory(category: ICategory) {
    try {
      const CategoryObject = Parse.Object.extend('BookCategory');
      const newCategory = new CategoryObject();
      newCategory.set('name', category.name);
      newCategory.set('description', category.description);

      // Adiciona os gêneros à categoria
      const GenreObject = Parse.Object.extend('BookGenre');
      const relation = newCategory.relation('genre'); // Cria uma relação 'genres'

      // Associa os gêneros à categoria
      category.genre.forEach((genre: IGenre) => {
        const genreToAdd = new GenreObject();
        genreToAdd.id = genre.id;
        relation.add(genreToAdd); // Adiciona o gênero à relação
      });

      const result = await newCategory.save();
      console.log(result);
    } catch (e) {
      console.error('Erro ao adicionar categoria:', e);
    }
  }

  async updateCategory(category: ICategory) {
    try {
      const CategoryObject = Parse.Object.extend('BookCategory');
      const query = new Parse.Query(CategoryObject);
      const categoryToUpdate = await query.get(category.id!);

      // Atualiza as propriedades da categoria
      categoryToUpdate.set('name', category.name);
      categoryToUpdate.set('description', category.description);

      // Adiciona ou atualiza a relação com os gêneros
      const GenreObject = Parse.Object.extend('BookGenre');
      const relation = categoryToUpdate.relation('genre');

      // Primeiro, remove todos os gêneros existentes para garantir uma atualização completa
      const currentGenres = await relation.query().find();
      currentGenres.forEach((genre) => relation.remove(genre));

      // Associa os novos gêneros à categoria
      category.genre.forEach((genre: IGenre) => {
        const genreToAdd = new GenreObject();
        genreToAdd.id = genre.id;
        relation.add(genreToAdd);
      });

      const result = await categoryToUpdate.save();
    } catch (e) {
      console.error('Erro ao atualizar categoria:', e);
    }
  }

  async deleteCategory(id: string) {
    try {
      const query = new Parse.Query('BookCategory');
      const categoryToDelete = await query.get(id);

      if (categoryToDelete) {
        await categoryToDelete.destroy();
        console.log('Categoria deletado com sucesso');
      }
    } catch (e) {
      console.error('Erro ao deletar categoria:', e);
    }
  }
}
