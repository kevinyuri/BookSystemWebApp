export interface IBook {
  id?: string;
  title: string;
  description: string;
  category: ICategory;
  author: IAuthor[];
}

export interface ICategory {
  id?: string;
  name: string;
  description: string;
  genre: IGenre[];
}

export interface IAuthor {
  id?: string;
  name: string;
}

export interface IGenre {
  id?: string;
  name: string;
}
