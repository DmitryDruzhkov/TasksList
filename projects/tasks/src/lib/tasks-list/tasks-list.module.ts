import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { TasksApiService } from './tasks-api.service';
import { TasksListComponent } from './components/tasks-list/tasks-list.component';
import { TasksListService } from './tasks-list.service';
import { MatIconModule } from '@angular/material/icon';
import { ColoredDotModule, FckToolbarService, ToolbarModule, ExpandableListItemModule, PropertyModule } from '@myApp/fck';
import { MatPaginatorModule } from '@angular/material/paginator';
import { FiltersModule } from '@myApp/common';
import { MatSidenavModule } from '@angular/material/sidenav';
import { TasksComponent } from './components/tasks/tasks.component';
import { MatButtonModule } from '@angular/material/button';
import { TasksListMobileComponent } from './components/tasks-list-mobile/tasks-list-mobile.component';
import { ScrollingModule } from '@angular/cdk/scrolling';

@NgModule({
  imports: [
    CommonModule,
    MatTableModule,
    MatIconModule,
    MatPaginatorModule,
    ColoredDotModule,
    FiltersModule,
    MatSidenavModule,
    ToolbarModule,
    MatButtonModule,
    ExpandableListItemModule,
    PropertyModule,
    ScrollingModule,
  ],
  providers: [
    TasksApiService,
    TasksListService,
    FckToolbarService,
],
  declarations: [
    TasksListComponent,
    TasksComponent,
    TasksListMobileComponent,
  ]
})
export class TasksListModule {

}
