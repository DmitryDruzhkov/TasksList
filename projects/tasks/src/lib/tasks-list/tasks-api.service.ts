import { Injectable, Inject } from '@angular/core';
import { Observable } from 'rxjs';
import { CommonTaskStatus, Task, TaskDto, taskTypes, TasksResponseDto, TaskTypes } from './models';
import { map } from 'rxjs/operators';
import { FiltersValue, LOCATION_SERVICE, ILocationService } from '@myApp/common';
import { HttpClient, HttpParams } from '@angular/common/http';

const statusDescriptions: Map<CommonTaskStatus, string> = new Map([
  [CommonTaskStatus.OPEN, 'Нужно выполнить'],
  [CommonTaskStatus.IN_PROGRESS, 'Выполняется'],
  [CommonTaskStatus.COMPLETE, 'Выполнена'],
  [CommonTaskStatus.CANCELED, 'Отменено'],
]);

const apiBaseUrl = '/api/tasks/v1';

@Injectable()
export class TasksApiService {

  constructor(
    private http: HttpClient,
    @Inject(LOCATION_SERVICE) private location: ILocationService) { }

  private get storeID(): string {
    return this.location.get().storeID;
  }

  getTasksList(filtersValue: FiltersValue): Observable<Task[]> {
    let httpParams = new HttpParams();
    Object.keys(filtersValue).forEach((key) => {
        httpParams = httpParams.append(key, filtersValue[key]);
    });
    return this.http.get<TasksResponseDto>(`${apiBaseUrl}/tasks?objectId=${this.storeID}`, { params: httpParams }).pipe(
      map((tasksResponse: TasksResponseDto) => tasksResponse.tasks.map((taskDto: TaskDto) => ({
        ...taskDto,
        estimationDate: taskDto.estimationDate ? new Date(taskDto.estimationDate) : null,
        creationDate: taskDto.creationDate ? new Date(taskDto.creationDate) : null,
        status: {
          status: taskDto.status,
          description: statusDescriptions.get(taskDto.status)
        },
        type: {
          type: taskDto.type,
          description: taskTypes[taskDto.type]
        },
        canDelete: this.taskCanDeleted(taskDto.type, taskDto.status)
      })))
    );
  }

  taskCanDeleted(taskType: TaskTypes, taskStatus: CommonTaskStatus): boolean {
    return  [TaskTypes.RECEIVING_CONTAINER, TaskTypes.RECEIVING_INITIAL].includes(taskType) && 
            [CommonTaskStatus.IN_PROGRESS, CommonTaskStatus.OPEN].includes(taskStatus);
  }

  deleteTask(task: Task): Observable<Object> {
    const payload = {
      domain: task.domain,
      id: task.id,
    };

    return this.http.post(`${apiBaseUrl}/tasks/cancel`, payload);
  }

}
