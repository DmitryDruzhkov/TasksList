export enum SortType {
  DEFAULT = 'DEFAULT',
  STATUS = 'STATUS',
  TYPE = 'TYPE',
  CREATION_DATE_ASC = 'CREATION_DATE_ASC',
  CREATION_DATE_DESC = 'CREATION_DATE_DESC',
  ASSIGNEE = 'ASSIGNEE'
}

export enum TaskTypes {
  RECEIVING_INITIAL = 'RECEIVING_INITIAL',
  RECEIVING_CONTAINER = 'RECEIVING_CONTAINER',
  REPLENISHMENT_FS = 'REPLENISHMENT_FS',
  REPLENISHMENT_FR = 'REPLENISHMENT_FR'
}

export enum TaskDomains {
  RECEIVING = 'RECEIVING',
  REPLENISHMENT = 'REPLENISHMENT'
}

export enum CommonTaskStatus {
  OPEN = 'OPEN',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETE = 'COMPLETE',
  CANCELED = 'CANCELED'
}

export const defaultCommonTaskStatuses = [
  CommonTaskStatus.OPEN,
  CommonTaskStatus.IN_PROGRESS,
];

export const defaultTaskTypes = [
  TaskTypes.RECEIVING_INITIAL,
  TaskTypes.RECEIVING_CONTAINER,
  TaskTypes.REPLENISHMENT_FR,
  TaskTypes.REPLENISHMENT_FS,
];

export const commonTaskStatuses = {
  [CommonTaskStatus.OPEN]: 'Нужно выполнить',
  [CommonTaskStatus.IN_PROGRESS]: 'Выполняется',
  [CommonTaskStatus.COMPLETE]: 'Выполнена',
  [CommonTaskStatus.CANCELED]: 'Отменено',
};

export const taskTypes = {
  [TaskTypes.RECEIVING_INITIAL]: 'Разгрузка',
  [TaskTypes.RECEIVING_CONTAINER]: 'Распаковка',
  [TaskTypes.REPLENISHMENT_FR]: 'Пополнение с приемки',
  [TaskTypes.REPLENISHMENT_FS]: 'Пополнение со склада',
};

export const colorByStatus: Map<CommonTaskStatus, 'green' | 'red' | 'gray' | 'checked_green' | 'orange'> = new Map([
  [CommonTaskStatus.OPEN, 'red'],
  [CommonTaskStatus.IN_PROGRESS, 'orange'],
  [CommonTaskStatus.COMPLETE, 'checked_green'],
  [CommonTaskStatus.CANCELED, 'gray'],
]);

export interface TasksResponseDto {
  tasks: TaskDto[];
}

export interface TaskDto {
  id: string;
  type: TaskTypes;
  domain: TaskDomains;
  status: CommonTaskStatus;
  estimationDate?: string;
  creationDate: string;
  employeeId?: string;
  employeeFullName?: string;
}

export interface Task {
  id: string;
  domain: TaskDomains;
  type: {
    type: TaskTypes;
    description: string;
  };
  status: {
    status: CommonTaskStatus;
    description: string;
  };
  estimationDate?: Date;
  creationDate: Date;
  employeeId?: string;
  employeeFullName?: string;
  canDelete: boolean;
}
