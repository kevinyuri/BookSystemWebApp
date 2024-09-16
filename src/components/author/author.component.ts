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
import { AuthorDataService } from '../../services/author.service';
import { IAuthor } from '../../interfaces';

@Component({
  selector: 'app-author',
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
  templateUrl: './author.component.html',
  styleUrl: './author.component.css',
})
export class AuthorComponent {
  constructor(
    private authorService: AuthorDataService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService
  ) {}

  authorList: IAuthor[] = [];
  displayModal: boolean = false;
  newAuthorName: string = '';
  loading: boolean = false;
  tittleHeader: string = 'Adicionar novo Autor';
  btnTitle: string = 'Salvar';
  id: string = '';

  async ngOnInit() {
    await this.authorService.setAuthor();
    await this.getAuthorList();
  }

  async getAuthorList() {
    this.authorList = this.authorService.getAuthor();
  }

  async setAuthorList() {
    await this.authorService.setAuthor();
  }

  openModal() {
    this.displayModal = true;
  }

  closeModal() {
    this.displayModal = false;
    this.newAuthorName = '';
  }

  criar() {
    this.btnTitle = 'Salvar';
    this.tittleHeader = 'Adicionar novo Autor';
    this.id = '';
    this.newAuthorName = '';
    this.openModal();
  }

  async regenerateList() {
    this.loading = false;
    await this.setAuthorList();
    await this.getAuthorList();
  }

  async saveAuthor() {
    if (this.newAuthorName && !this.id) {
      this.loading = true;
      const payload: IAuthor = {
        name: this.newAuthorName,
      };
      await this.authorService.addAuthor(payload).then((result) => {
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
    const payload: IAuthor = {
      id: this.id,
      name: this.newAuthorName,
    };
    await this.authorService.updateAuthor(payload).then((result) => {
      setTimeout(async () => {
        await this.regenerateList();
        this.showSuccessToast();
      }, 1000);
    });
    this.closeModal();
  }

  editAuthor(author: any) {
    this.id = author.id;
    this.tittleHeader = 'Editar Autor do Livro';
    this.btnTitle = 'Editar';
    this.openModal();
    this.newAuthorName = author.name;
  }

  async deleteAuthor(event: any) {
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
        await this.authorService.deleteAuthor(event.id).then((result) => {
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
      detail: 'Autor salvo com sucesso!',
    });
  }

  showDeleteToast() {
    this.messageService.add({
      severity: 'success',
      summary: 'Sucesso',
      detail: 'Autor deletado com sucesso!',
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
