import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from '../components/home/home.component';
import { GenrerComponent } from '../components/genrer/genrer.component';
import { AuthorComponent } from '../components/author/author.component';
import { CategoryComponent } from '../components/category/category.component';
import { BookComponent } from '../components/book/book.component';

export const routes: Routes = [
  { path: 'home', component: HomeComponent },
  { path: 'genres', component: GenrerComponent },
  { path: 'authors', component: AuthorComponent },
  { path: 'categories', component: CategoryComponent },
  { path: 'books', component: BookComponent },
  { path: '', redirectTo: '/home', pathMatch: 'full' }, // Redirecionar para home como padrão
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
