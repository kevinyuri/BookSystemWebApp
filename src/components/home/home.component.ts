import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import * as Parse from 'parse';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { DialogModule } from 'primeng/dialog';
import { FormsModule } from '@angular/forms';
import { IGenre, ICategory, IAuthor } from '../../interfaces';
import { BookComponent } from '../book/book.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    TableModule,
    ButtonModule,
    InputTextModule,
    DialogModule,
    FormsModule,
    BookComponent,
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent {
  books: any[] = [];
  booksCategories: ICategory[] = [];
  booksGenrer: IGenre[] = [];
  booksAuthor: IAuthor[] = [];
  displayEdit: boolean = false;
  selectedBook: any = null;

  constructor() {}

  bookGenre: any[] = [];
}
