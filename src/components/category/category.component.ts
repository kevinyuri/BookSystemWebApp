import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DialogModule } from 'primeng/dialog';
import { DividerModule } from 'primeng/divider';
import { InputTextModule } from 'primeng/inputtext';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { TableModule } from 'primeng/table';
import { ToastModule } from 'primeng/toast';
import { CategoryDataService } from '../../services/category.service';
import { ICategory, IGenre } from '../../interfaces';
import { MultiSelectModule } from 'primeng/multiselect';
import { GenreDataService } from '../../services/genre.service';

@Component({
  selector: 'app-category',
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
  ],
  providers: [MessageService, ConfirmationService],
  templateUrl: './category.component.html',
  styleUrl: './category.component.css',
})
export class CategoryComponent {
  constructor(
    private categoryService: CategoryDataService,
    private messageService: MessageService,
    private genreService: GenreDataService,
    private confirmationService: ConfirmationService
  ) {}

  categoryList: ICategory[] = [];
  genreList: any[] = [];
  selectedGenre: any[] = [];
  displayModal: boolean = false;
  newCategoryName: string = '';
  newCategoryDescription: string = '';
  newCategoryGenres: IGenre[] = [];
  loading: boolean = false;
  tittleHeader: string = 'Adicionar nova Categoria';
  btnTitle: string = 'Salvar';
  id: string = '';

  async ngOnInit() {
    await this.categoryService.setCategory();
    await this.getGenerOptions();
    await this.getCategoryList();
  }

  async getGenerOptions() {
    this.genreList = this.genreService.getGenre();
    this.genreList = this.genreList.map((g) => ({
      name: g.name,
      code: g.id,
    }));
    console.log(this.genreList);
  }

  async getCategoryList() {
    this.categoryList = this.categoryService.getCategory();
  }

  async setCategoryList() {
    await this.categoryService.setCategory();
  }

  openModal() {
    this.displayModal = true;
  }

  closeModal() {
    this.displayModal = false;
    this.newCategoryName = '';
  }

  criar() {
    this.btnTitle = 'Salvar';
    this.tittleHeader = 'Adicionar nova Categoria';
    this.id = '';
    this.newCategoryName = '';
    this.newCategoryDescription = '';
    this.selectedGenre = [];
    this.openModal();
  }

  async regenerateList() {
    this.loading = false;
    await this.setCategoryList();
    await this.getCategoryList();
  }

  async saveCategory() {
    if (this.newCategoryName && !this.id) {
      this.loading = true;
      this.newCategoryGenres = this.selectedGenre.map((i) => ({
        id: i.code,
        name: i.name,
      }));
      const payload: ICategory = {
        name: this.newCategoryName,
        description: this.newCategoryDescription,
        genre: this.newCategoryGenres,
      };
      await this.categoryService.addCategory(payload).then((result) => {
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
    this.newCategoryGenres = this.selectedGenre.map((i) => ({
      id: i.code,
      name: i.name,
    }));
    const payload: ICategory = {
      id: this.id,
      name: this.newCategoryName,
      description: this.newCategoryDescription,
      genre: this.newCategoryGenres,
    };
    await this.categoryService.updateCategory(payload).then((result) => {
      setTimeout(async () => {
        this.showSuccessToast();
        await this.regenerateList();
      }, 2000);
    });
    this.closeModal();
  }

  editCategory(category: any) {
    this.id = category.id;
    this.tittleHeader = 'Editar Categoria do Livro';
    this.btnTitle = 'Editar';
    this.openModal();
    this.newCategoryName = category.name;
    this.newCategoryDescription = category.description;
    this.selectedGenre = category.genre.map((g: any) => ({
      name: g.name,
      code: g.id,
    }));
  }

  async deleteCategory(event: any) {
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
        await this.categoryService.deleteCategory(event.id).then((result) => {
          setTimeout(async () => {
            await this.regenerateList();
            this.showDeleteToast();
          }, 500);
        });
      },
      reject: () => {},
    });
  }

  getGenresFormated(category: ICategory) {
    return category.genre.map((i) => i.name).join(', ');
  }

  showSuccessToast() {
    this.messageService.add({
      severity: 'success',
      summary: 'Sucesso',
      detail: 'Categoria salvo com sucesso!',
    });
  }

  showDeleteToast() {
    this.messageService.add({
      severity: 'success',
      summary: 'Sucesso',
      detail: 'Categoria deletado com sucesso!',
    });
  }

  showErrorToast() {
    this.messageService.add({
      severity: 'error',
      summary: 'Error',
      detail: 'Erro ao salvar autor!',
    });
  }
}
