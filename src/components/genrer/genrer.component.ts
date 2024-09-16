import { Component } from '@angular/core';
import { IGenre } from '../../interfaces';
import { CommonModule } from '@angular/common';
import { GenreDataService } from '../../services/genre.service';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { DialogModule } from 'primeng/dialog';
import { FormsModule } from '@angular/forms';
import { DividerModule } from 'primeng/divider';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { ToastModule } from 'primeng/toast';
import { MessageService, ConfirmationService } from 'primeng/api';
import { ConfirmDialogModule } from 'primeng/confirmdialog';

@Component({
  selector: 'app-genrer',
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
  ],
  providers: [MessageService, ConfirmationService],
  templateUrl: './genrer.component.html',
  styleUrl: './genrer.component.css',
})
export class GenrerComponent {
  constructor(
    private genreService: GenreDataService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService
  ) {}
  genreList: IGenre[] = [];
  displayModal: boolean = false;
  newGenreName: string = '';
  loading: boolean = false;
  tittleHeader: string = 'Adicionar novo Gênero';
  btnTitle: string = 'Salvar';
  id: string = '';

  async ngOnInit() {
    await this.genreService.setGenre();
    await this.getGenreList();
  }

  async getGenreList() {
    this.genreList = this.genreService.getGenre();
  }

  async setGenreList() {
    await this.genreService.setGenre();
  }

  openModal() {
    this.displayModal = true;
  }

  closeModal() {
    this.displayModal = false;
    this.id = '';
    this.newGenreName = '';
  }

  criar() {
    this.btnTitle = 'Salvar';
    this.tittleHeader = 'Adicionar novo Gênero';
    this.id = '';
    this.newGenreName = '';
    this.openModal();
  }

  async regenerateList() {
    this.loading = false;
    await this.setGenreList();
    await this.getGenreList();
  }

  async saveGenre() {
    if (this.newGenreName && !this.id) {
      this.loading = true;
      const payload: IGenre = {
        name: this.newGenreName,
      };
      await this.genreService.addGenre(payload).then((result) => {
        setTimeout(async () => {
          await this.regenerateList();
          this.showSuccessToast();
        }, 1000);
      });
      this.closeModal();
    }

    if (this.id) {
      this.edit();
      this.id = '';
    }
  }

  async edit() {
    this.loading = true;
    const payload: IGenre = {
      id: this.id,
      name: this.newGenreName,
    };
    await this.genreService.updateGenre(payload).then((result) => {
      setTimeout(async () => {
        await this.regenerateList();
        this.showSuccessToast();
      }, 1000);
    });
    this.closeModal();
  }

  editGenre(genre: any) {
    this.id = genre.id;
    this.tittleHeader = 'Editar Gênero do Livro';
    this.btnTitle = 'Editar';
    this.openModal();
    this.newGenreName = genre.name;
  }

  async deleteGenre(event: any) {
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
        await this.genreService.deleteGenre(event.id).then((result) => {
          setTimeout(async () => {
            await this.regenerateList();
            this.showDeleteToast();
          }, 500);
        });
      },
      reject: () => {},
    });
  }

  showSuccessToast() {
    this.messageService.add({
      severity: 'success',
      summary: 'Sucesso',
      detail: 'Genero salvo com sucesso!',
    });
  }

  showDeleteToast() {
    this.messageService.add({
      severity: 'success',
      summary: 'Sucesso',
      detail: 'Gênero deletado com sucesso!',
    });
  }

  showErrorToast() {
    this.messageService.add({
      severity: 'error',
      summary: 'Error',
      detail: 'Failed to save genre!',
    });
  }
}
