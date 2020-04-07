import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Route, RouterModule } from '@angular/router';
import { TasksListModule } from './tasks-list/tasks-list.module';
import { TasksComponent } from './tasks-list/components/tasks/tasks.component';

const tasksRoutes: Route[] = [
  {
    path: '',
    component: TasksComponent
  }
];

@NgModule({
  imports: [
    CommonModule,
    TasksListModule,
    RouterModule.forChild(tasksRoutes)
  ]
})
export class TasksModule {}
