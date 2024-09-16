import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DialogModule } from 'primeng/dialog';
import { DividerModule } from 'primeng/divider';
import { InputTextModule } from 'primeng/inputtext';
import { MultiSelectModule } from 'primeng/multiselect';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { TableModule } from 'primeng/table';
import { ToastModule } from 'primeng/toast';
import { IAuthor, IBook, ICategory } from '../../interfaces';
import { BookDataService } from '../../services/book.service';
import { CategoryDataService } from '../../services/category.service';
import { AuthorDataService } from '../../services/author.service';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { DropdownModule } from 'primeng/dropdown';

@Component({
  selector: 'app-book',
  standalone: true,
  imports: [
    CommonModule,
    TableModule,
    ButtonModule,
    InputTextModule,
    DialogModule,
    FormsModule,
    DividerModule,
    ProgressSpinnerModule,
    ToastModule,
    ConfirmDialogModule,
    MultiSelectModule,
    InputTextareaModule,
    DropdownModule,
  ],
  providers: [MessageService, ConfirmationService],
  templateUrl: './book.component.html',
  styleUrl: './book.component.css',
})
export class BookComponent {
  constructor(
    private bookService: BookDataService,
    private messageService: MessageService,
    private categoryService: CategoryDataService,
    private authorService: AuthorDataService,
    private confirmationService: ConfirmationService
  ) {}

  bookList: IBook[] = [];
  authorList: any[] = [];
  selectedAuthor: any[] = [];
  categoryList: any[] = [];
  selectedCategory: any | null;
  displayModal: boolean = false;
  newBookName: string = '';
  newBookDescription: string = '';
  newBookAuthors: IAuthor[] = [];
  newBookCategory!: ICategory;
  loading: boolean = false;
  tittleHeader: string = 'Adicionar novo Livro';
  btnTitle: string = 'Salvar';
  id: string = '';

  async ngOnInit() {
    await this.bookService.setBook();
    await this.categoryService.setCategory();
    await this.authorService.setAuthor();
    await this.getAuthorOptions();
    await this.getCategoryOptions();
    await this.getBookList();
  }

  async getAuthorOptions() {
    this.authorList = this.authorService.getAuthor();
    this.authorList = this.authorList.map((a) => ({
      name: a.name,
      code: a.id,
    }));
    console.log(this.authorList);
  }

  async getCategoryOptions() {
    this.categoryList = this.categoryService.getCategory();
    this.categoryList = this.categoryList.map((c) => ({
      name: c.name,
      code: c.id,
    }));
    console.log(this.categoryList);
  }

  async setBookList() {
    await this.bookService.setBook();
  }

  async getBookList() {
    this.bookList = this.bookService.getBook();
  }

  criar() {
    this.btnTitle = 'Salvar';
    this.tittleHeader = 'Adicionar novo Livro';
    this.id = '';
    this.newBookName = '';
    this.newBookDescription = '';
    this.selectedAuthor = [];
    this.selectedCategory = null;
    this.openModal();
  }

  openModal() {
    this.displayModal = true;
  }

  closeModal() {
    this.displayModal = false;
    this.newBookName = '';
    this.newBookDescription = '';
    this.selectedAuthor = [];
    this.selectedCategory = null;
  }

  async saveBook() {
    if (this.newBookName && !this.id) {
      this.loading = true;
      this.newBookAuthors = this.selectedAuthor.map((i) => ({
        id: i.code,
        name: i.name,
      }));
      this.newBookCategory = {
        id: this.selectedCategory?.code,
        genre: this.selectedCategory?.genre!,
        name: this.selectedCategory?.name!,
        description: this.selectedCategory?.description!,
      };
      const payload: IBook = {
        title: this.newBookName,
        description: this.newBookDescription,
        author: this.newBookAuthors,
        category: this.newBookCategory,
      };
      await this.bookService.addBook(payload).then((result) => {
        setTimeout(async () => {
          await this.regenerateList();
          this.showSuccessToast();
        }, 1000);
      });
      this.closeModal();
    }

    if (this.id) {
      this.edit();
    }
  }

  async edit() {
    this.loading = true;
    this.newBookAuthors = this.selectedAuthor.map((a) => ({
      id: a.code,
      name: a.name,
    }));
    this.newBookCategory = {
      id: this.selectedCategory.code,
      name: this.selectedCategory.name,
      description: this.selectedCategory.description,
      genre: this.selectedCategory.genre,
    };
    const payload: IBook = {
      id: this.id,
      title: this.newBookName,
      description: this.newBookDescription,
      author: this.newBookAuthors,
      category: this.newBookCategory,
    };
    await this.bookService.updateBook(payload).then((result) => {
      setTimeout(async () => {
        this.showSuccessToast();
        await this.regenerateList();
      }, 2000);
    });
    this.closeModal();
  }

  editBook(book: any) {
    console.log(book.category.get(`name`));
    this.id = book.id!;
    this.tittleHeader = 'Editar Livro';
    this.btnTitle = 'Editar';
    this.openModal();
    this.newBookName = book.title;
    this.newBookDescription = book.description;
    this.selectedAuthor = book.author.map((a: any) => ({
      name: a.name,
      code: a.id,
    }));
    this.selectedCategory = {
      name: book.category.get('name'),
      code: book.category.id,
    };
  }

  getAuthorsFormated(book: IBook) {
    return book.author.map((i) => i.name).join(', ');
  }

  getCategoriaName(book: any) {
    return book.category.get('name');
  }

  async regenerateList() {
    this.loading = false;
    await this.setBookList();
    await this.getBookList();
  }

  showSuccessToast() {
    this.messageService.add({
      severity: 'success',
      summary: 'Sucesso',
      detail: 'Livro salvo com sucesso!',
    });
  }

  showDeleteToast() {
    this.messageService.add({
      severity: 'success',
      summary: 'Sucesso',
      detail: 'Livro deletado com sucesso!',
    });
  }

  showErrorToast() {
    this.messageService.add({
      severity: 'error',
      summary: 'Error',
      detail: 'Erro ao salvar livro!',
    });
  }

  async deleteBook(event: any) {
    this.confirmationService.confirm({
      target: event.target as EventTarget,
      message: 'Deseja excluir o item permanentemente ?',
      header: 'Confirmação',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Sim',
      rejectLabel: 'Não',
      rejectButtonStyleClass: 'p-button-text',
      accept: async () => {
        this.loading = true;
        await this.bookService.deleteBook(event.id).then((result) => {
          setTimeout(async () => {
            await this.regenerateList();
            this.showDeleteToast();
          }, 500);
        });
      },
      reject: () => {},
    });
  }
}
