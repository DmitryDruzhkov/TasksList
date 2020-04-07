import {
  Component,
  Inject,
  OnDestroy,
  OnInit,
  ViewChild,
  ChangeDetectorRef,
  ChangeDetectionStrategy,
  ComponentFactoryResolver,
  Injector
} from '@angular/core';
import { TasksApiService } from '../../tasks-api.service';
import { Subject, throwError, Observable, combineLatest } from 'rxjs';
import { SortType, Task } from '../../models';
import {
  CommonNotificationsService,
  IToolbarService,
  NOTIFICATIONS_SERVICE,
  TOOLBAR_TOKEN,
  FiltersService,
  FiltersClass,
  Filters,
  ConfirmationOptions,
  FiltersValue,
  LOCATION_SERVICE,
  ILocationService,
  BREAKPOINTS_SERVICE,
  BreakpointsService,
  SyncDbService
} from '@myApp/common';
import { ActivatedRoute } from '@angular/router';
import { catchError, takeUntil, map, filter, startWith, switchMap } from 'rxjs/operators';
import { TasksListService } from '../../tasks-list.service';
import { FckToolbarService, ToolbarHeight, ToolbarEvent, ToolbarComponent, Action } from '@myApp/fck';
import { TasksFilters } from './tasks-filters';
import { MatSidenav } from '@angular/material/sidenav';
import { TasksToolbarActions } from '../../toolbar-actions';

@Component({
  templateUrl: 'tasks.component.html',
  styleUrls: ['./tasks.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TasksComponent implements OnInit, OnDestroy {
  @ViewChild('drawer', {static: true}) drawer: MatSidenav;

  filters: FiltersClass = new FiltersClass();
  ToolbarHeight: typeof ToolbarHeight = ToolbarHeight;

  onDestroy: Subject<void> = new Subject<void>();
  isMobile: Observable<boolean>;

  tasks: Observable<Task[]>;

  constructor(
    private api: TasksApiService,
    private route: ActivatedRoute,
    @Inject(NOTIFICATIONS_SERVICE) private notifications: CommonNotificationsService,
    @Inject(TOOLBAR_TOKEN) private toolbarService: IToolbarService,
    @Inject(LOCATION_SERVICE) private location: ILocationService,
    @Inject(BREAKPOINTS_SERVICE) private breakpoints: BreakpointsService,
    private service: TasksListService,
    private fckToolbarService: FckToolbarService,
    private filtersService: FiltersService,
    private cdRef: ChangeDetectorRef,
    private resolver: ComponentFactoryResolver,
    private injector: Injector,
    private syncDbService: SyncDbService,
  ) {
  }

  ngOnInit(): void {
    this.syncDbService.requestSync();

    const factory = this.resolver.resolveComponentFactory(ToolbarComponent);
    this.toolbarService.setConfig({
      back: {url: '', route: this.route},
      component: factory.create(this.injector).hostView
    });

    this.initFilters();
    this.tasks = this.getTasks();

    this.fckToolbarService.events.pipe(
      takeUntil(this.onDestroy)
    ).subscribe(event => {
      switch (event.action) {
        case ToolbarEvent.ToggleFilters:
          this.drawer.toggle();
          this.cdRef.markForCheck();
          break;
        default:
          return;
      }
    });

    this.location.getObservable().pipe(
      takeUntil(this.onDestroy),
    ).subscribe(_ => {
      this.drawer.close();
      this.initFilters();
    });

    this.isMobile = this.breakpoints.isMobile;

    this.fckToolbarService.setToolbarActions(TasksToolbarActions);
    this.fckToolbarService.setTitle('Задачи');
  }

  initFilters(): void {
    const filters: Filters = this.filtersService.getExistFilters(TasksFilters.filterName) || TasksFilters.initDefaultFilters();
    this.filtersService.saveFilters(TasksFilters.filterName, filters);
    this.filters.setFilters(filters);
  }

  applyFilters(): void {
    this.drawer.close();
    const filters: Filters = this.filters.getFilters();
    this.filtersService.saveFilters(TasksFilters.filterName, filters);
    this.filters.setFilters(filters);
  }

  resetFilters(): void {
    const filters: Filters = TasksFilters.initDefaultFilters();
    this.filtersService.saveFilters(TasksFilters.filterName, filters);
    this.filters.setFilters(filters);
  }

  openTask(task: Task): void {
    this.service.openTask(task);
  }

  deleteTask(task: Task): void {
    const dialogOptions: ConfirmationOptions = {
      title: `Удалить задачу №${task.id}?`,
      confirmationMessage: 'Вы уверены что хотите удалить задачу? Все незавершенные операции по задаче будут сброшены к предыдущему завершенному состоянию.',
      confirmLabel: 'УДАЛИТЬ',
      cancelLabel: 'ОТМЕНА',
    };

    this.notifications.requestConfirmation(dialogOptions).pipe(
      filter(Boolean),
      switchMap(() => this.api.deleteTask(task).pipe(
        catchError((err) => {
          this.showSnackbar(`Возникла ошибка при удалении задачи №${task.id}.`);
          return throwError(err);
        })
      )),
      takeUntil(this.onDestroy)
    ).subscribe(() => {
      this.initFilters();
      this.showSnackbar(`Задача №${task.id} удалена.`);
    });
  }

  private getTasks(): Observable<Task[]> {
    return combineLatest([
      this.loadTasks(),
      this.fckToolbarService.events.pipe(
        filter((event: Action<ToolbarEvent>) => event.action === ToolbarEvent.Sort),
        map((event: Action<ToolbarEvent>) => event.payload),
        startWith(SortType.DEFAULT)
      )
    ]).pipe(
      map(([tasksList, sort]: [Task[], SortType]) => this.service.sortTasks(tasksList, sort)),
      takeUntil(this.onDestroy),
      catchError(err => {
        this.showSnackbar('Не удалось загрузить список задач.');
        return throwError(err);
      })
    );
  }

  private loadTasks(): Observable<Task[]> {
    return this.filters.selectFilters().pipe(
      switchMap((filter: Filters) => {
        const filtersValue: FiltersValue = this.filtersService.getFilterValue(filter);
        return this.api.getTasksList(filtersValue);
      })
    );
  }

  private showSnackbar(message: string): void {
    this.notifications.showSnackbar(message);
  }

  ngOnDestroy(): void {
    this.notifications.dismissSnackbar();
    this.onDestroy.next();
    this.onDestroy.complete();
  }
}
