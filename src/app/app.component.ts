import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import * as Parse from 'parse';
import { HomeComponent } from '../components/home/home.component';
import { ToolbarModule } from 'primeng/toolbar';
import { Router } from '@angular/router';
import { PanelMenuModule } from 'primeng/panelmenu';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { GenreDataService } from '../services/genre.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    HomeComponent,
    ToolbarModule,
    PanelMenuModule,
    ButtonModule,
    CardModule,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  title = 'my-angular-project';
  menuItems: any[] = [];

  constructor(private router: Router, private genreService: GenreDataService) {}

  async ngOnInit() {
    await this.genreService.setGenre();
    this.menuItems = [
      {
        label: 'Livros',
        icon: 'pi pi-book',
        command: () => this.router.navigate(['/books']), // Rota para a página de livros
      },
      {
        label: 'Autores',
        icon: 'pi pi-user',
        command: () => this.router.navigate(['/authors']), // Rota para a página de autores
      },
      {
        label: 'Categorias',
        icon: 'pi pi-tags',
        command: () => this.router.navigate(['/categories']), // Rota para a página de categorias
      },
      {
        label: 'Gêneros',
        icon: 'pi pi-list',
        command: () => this.router.navigate(['/genres']), // Rota para a página de gêneros
      },
    ];
  }

  navigateHome() {
    this.router.navigate(['/home']);
  }

  navigateTo(route: string) {
    this.router.navigate([`/${route}`]);
  }
}

Parse.initialize(
  'US1hMVTcUY7eRFYTw8DEEENTOR2rNv42uR6hLEym',
  'fIcdLRrI004kQxcjbCwgap4vSvKsOAmyqpcdjE9m'
);
Parse.CoreManager.set('SERVER_URL', 'https://parseapi.back4app.com/');
