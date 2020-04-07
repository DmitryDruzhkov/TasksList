import { Component, ChangeDetectionStrategy, Input, Output, EventEmitter  } from '@angular/core';
import { Task, CommonTaskStatus, colorByStatus } from '../../models';

@Component({
  selector: 'tasks-list-mobile',
  templateUrl: 'tasks-list-mobile.component.html',
  styleUrls: ['./tasks-list-mobile.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TasksListMobileComponent {

  @Input() set data(data) {
    this.tasks = data ? data : [];
  }
  @Output() openTask: EventEmitter<Task> = new EventEmitter();
  @Output() deleteTask: EventEmitter<Task> = new EventEmitter();

  tasks: Task[] = [];

  onTaskDelete(task: Task, event: MouseEvent): void {
    event.stopPropagation();
    this.deleteTask.next(task);
  }

  onOpenTask(task: Task): void {
    this.openTask.next(task);
  }

  isLastEstimatedTask(task: Task): boolean {
    const taskIndex = this.tasks && this.tasks.findIndex(t => t === task);
    return taskIndex && task.estimationDate && this.tasks[taskIndex + 1] && !this.tasks[taskIndex + 1].estimationDate;
  }

  getColorByStatus(status: CommonTaskStatus): string {
    return colorByStatus.get(status);
  }
}
