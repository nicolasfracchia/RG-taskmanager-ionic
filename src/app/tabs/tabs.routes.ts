import { Routes } from '@angular/router';
import { TabsPage } from './tabs.page';

export const routes: Routes = [
  {
    path: '',
    component: TabsPage,
    children: [
      {
        path: 'tasks',
        loadComponent: () =>
          import('../tasks/tasks.page').then((m) => m.TasksPage),
      },
      {
        path: 'task-form',
        loadComponent: () =>
          import('../task-form/task-form.page').then((m) => m.TaskFormPage),
      },
      {
        path: '',
        redirectTo: '/tasks',
        pathMatch: 'full',
      },
    ],
  },
  {
    path: '',
    redirectTo: '/tasks',
    pathMatch: 'full',
  },
];
