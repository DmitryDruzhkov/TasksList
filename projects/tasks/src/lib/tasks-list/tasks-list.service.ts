import { Injectable } from '@angular/core';
import { CommonTaskStatus, SortType, Task, TaskDomains, TaskTypes } from './models';
import { Router } from '@angular/router';

export const taskDomainToRoute: Map<TaskDomains, string[]> = new Map([
  [TaskDomains.REPLENISHMENT, ['replenishment', 'task']],
  [TaskDomains.RECEIVING, ['receiving', 'receiving-tasks']]
]);

export const taskStatusPriority = [
  CommonTaskStatus.OPEN,
  CommonTaskStatus.IN_PROGRESS,
  CommonTaskStatus.COMPLETE,
  CommonTaskStatus.CANCELED,
];

export const taskTypesPriority = [
  TaskTypes.RECEIVING_INITIAL,
  TaskTypes.RECEIVING_CONTAINER,
  TaskTypes.REPLENISHMENT_FR,
  TaskTypes.REPLENISHMENT_FS,
];

export const comparatorBySortType: Map<SortType, (a: Task, b: Task) => number> = new Map([
  [SortType.DEFAULT, null],
  [SortType.TYPE, (a: Task, b: Task) => taskTypesPriority.indexOf(a.type.type) - taskTypesPriority.indexOf(b.type.type)],
  [SortType.STATUS, (a: Task, b: Task) => taskStatusPriority.indexOf(a.status.status) - taskStatusPriority.indexOf(b.status.status)],
  [SortType.CREATION_DATE_DESC, (a: Task, b: Task) => (b.creationDate && b.creationDate.getTime() || 0) - (a.creationDate && a.creationDate.getTime() || 0)],
  [SortType.CREATION_DATE_ASC, (a: Task, b: Task) => (a.creationDate && a.creationDate.getTime() || 0) - (b.creationDate && b.creationDate.getTime() || 0)],
  [SortType.ASSIGNEE, (a: Task, b: Task) => b.employeeFullName > a.employeeFullName ? 1 : -1],
]);


@Injectable()
export class TasksListService {

  constructor(
    private router: Router,
  ) {}

  openTask(task: Task): void {
    this.router.navigate([...taskDomainToRoute.get(task.domain), task.id]);
  }

  sortTasks(tasks: Task[], sortType: SortType): Task[] {
    const tasksWithEstimation = tasks.filter(task => task.estimationDate);
    const tasksWithoutEstimation = tasks.filter(task => !task.estimationDate);
    const comparator = comparatorBySortType.get(sortType);
    return [
      ...tasksWithEstimation.sort((a: Task, b: Task) => a.estimationDate.getTime() - b.estimationDate.getTime()),
      ...(comparator? tasksWithoutEstimation.sort(comparator) : tasksWithoutEstimation),
    ];
  }

}
