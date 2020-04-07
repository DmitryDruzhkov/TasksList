import { ToolbarAction, ToolbarEvent } from '@myApp/fck';
import { SortType } from './models';

export const TasksToolbarActions: ToolbarAction[] = [
  {
    displayName: 'Сортировка',
    icon: 'sort',
    extras: [
      {
        displayName: 'По умолчанию',
        icon: '',
        event: {
          action: ToolbarEvent.Sort,
          payload: SortType.DEFAULT
        }
      },
      {
        displayName: 'Сначала открытые',
        icon: '',
        event: {
          action: ToolbarEvent.Sort,
          payload: SortType.STATUS
        }
      },
      {
        displayName: 'По типу',
        icon: '',
        event: {
          action: ToolbarEvent.Sort,
          payload: SortType.TYPE
        }
      },
      {
        displayName: 'Сначала новые',
        icon: '',
        event: {
          action: ToolbarEvent.Sort,
          payload: SortType.CREATION_DATE_DESC
        }
      },
      {
        displayName: 'Сначала старые',
        icon: '',
        event: {
          action: ToolbarEvent.Sort,
          payload: SortType.CREATION_DATE_ASC
        }
      },
      {
        displayName: 'По исполнителю',
        icon: '',
        event: {
          action: ToolbarEvent.Sort,
          payload: SortType.ASSIGNEE
        }
      },
    ]
  },
  {
    displayName: 'Фильтры',
    icon: 'filter_list',
    event: {
      action: ToolbarEvent.ToggleFilters,
    }
  },
];
