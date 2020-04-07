import { Component, ViewChild, ChangeDetectionStrategy, Input, Output, EventEmitter  } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { Task, CommonTaskStatus, colorByStatus } from '../../models';

@Component({
  selector: 'tasks-list',
  templateUrl: 'tasks-list.component.html',
  styleUrls: ['./tasks-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TasksListComponent {
  @Input() set data(data) {
    this.dataSource.data = data ? data : [];
  }
  @Output() openTask: EventEmitter<Task> = new EventEmitter();
  @Output() deleteTask: EventEmitter<Task> = new EventEmitter();
  
  @ViewChild(MatPaginator, { static: false }) set paginator (paginator: MatPaginator) {
    this.dataSource.paginator = paginator;
  }

  displayedColumns = [
    "id",
    "type",
    "status",
    "creationDate",
    "employeeFullName",
    "delete"
  ];

  dataSource = new MatTableDataSource<Task>([]);

  onTaskDelete(task: Task, event: MouseEvent): void {
    event.stopPropagation();
    this.deleteTask.next(task);
  }

  onOpenTask(task: Task): void {
    this.openTask.next(task);
  }

  isLastEstimatedTask(task: Task): boolean {
    const taskIndex = this.dataSource && this.dataSource.data && this.dataSource.data.findIndex(t => t === task);
    return taskIndex && task.estimationDate && this.dataSource.data[taskIndex + 1] && !this.dataSource.data[taskIndex + 1].estimationDate;
  }

  getColorByStatus(status: CommonTaskStatus): string {
    return colorByStatus.get(status);
  }
}
