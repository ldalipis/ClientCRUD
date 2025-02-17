import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./features/item-list/item-list.component').then((m) => m.ItemListComponent),
  },
  {
    path: 'item/:id',
    loadComponent: () =>
      import('./features/item/item.component').then((m) => m.ItemComponent),
  },
];
