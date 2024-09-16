import { Component } from '@angular/core';
import { CommonModule } from '@angular/common'
import * as Parse from 'parse';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { DialogModule } from 'primeng/dialog';
import { FormsModule } from '@angular/forms';
import { IGenre, ICategory, IAuthor } from '../../interfaces';


@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, TableModule,
    ButtonModule,
    InputTextModule,
    DialogModule,
    FormsModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {

  books: any[] = [];
  booksCategories: ICategory[] = [];
  booksGenrer: IGenre[] = [];
  booksAuthor: IAuthor[] = []
  displayEdit: boolean = false;
  selectedBook: any = null;

  constructor() { }

  bookGenre: any[] = [];

  async ngOnInit() {
    await this.listarGeneros();
    await this.listarCategorias();
    await this.listarAutores();
    await this.carregarLivros();
  }

  async carregarLivros() {
    try {
      const query = new Parse.Query('Book');
      const books = await query.find();
      this.books = books.map(book => ({
        id: book.id,
        title: book.get('title'),
        description: book.get('description'),
        category: book.get('category').get('name'),
      }));
      console.log(this.books)
    } catch (e) {
      console.log('Erro ao buscar livros:', e);
    }
  }

  async listarCategorias() {
    try {
      const query = new Parse.Query('BookCategory');
      const categorias = await query.find();

      // Iterar sobre as categorias e buscar os gêneros relacionados
      this.booksCategories = await Promise.all(categorias.map(async (c) => {
        const genresRelation = c.relation('genre');
        const genresQuery = genresRelation.query();
        const genres = await genresQuery.find();

        return {
          id: c.id,
          name: c.get('name'),
          description: c.get('description'),
          genre: genres.map(g => ({ id: g.id, name: g.get('name') }))
        };
      }));
      console.log(this.booksCategories)
    }
    catch {

    }
  }

  async listarGeneros() {
    try {
      const query = new Parse.Query('BookGenre');
      const generos = await query.find();
      this.booksGenrer = generos.map(g => ({
        id: g.id,
        name: g.get('name'),
      }))
      console.log(this.booksGenrer)
    }
    catch (e) {
      console.log('Erro ao buscar livros:', e);
    }
  }

  async listarAutores() {
    try {
      const query = new Parse.Query('BookAuthor');
      const autores = await query.find();
      this.booksAuthor = autores.map(a => ({
        id: a.id,
        name: a.get('name'),
      }))
      console.log(this.booksAuthor)
    }
    catch (e) {
      console.log('Erro ao buscar autores:', e);
    }
  }

  // Editar um livro
  editBook(book: any) {
    this.selectedBook = { ...book };
    this.displayEdit = true;
  }

  // Salvar mudanças no livro
  async saveBook() {
    try {
      const query = new Parse.Query('Author');
      const bookToEdit = await query.get(this.selectedBook.id);
      bookToEdit.set('title', this.selectedBook.title);
      await bookToEdit.save();
      this.displayEdit = false;
      this.carregarLivros(); // Recarrega a lista após a edição
    } catch (e) {
      console.log('Erro ao editar livro:', e);
    }
  }

  // Cancelar a edição
  cancelEdit() {
    this.selectedBook = null;
    this.displayEdit = false;
  }

  // Excluir um livro
  async deleteBook(book: any) {
    try {
      const query = new Parse.Query('Author');
      const bookToDelete = await query.get(book.id);
      await bookToDelete.destroy();
      this.carregarLivros(); // Recarrega a lista após exclusão
    } catch (e) {
      console.log('Erro ao excluir livro:', e);
    }
  }
}
