import { Filters, CheckboxOption, FilterTypes, CheckBoxFilter, InputFilter, DateFilter } from '@myApp/common';
import { CommonTaskStatus, defaultCommonTaskStatuses, commonTaskStatuses, TaskTypes, defaultTaskTypes, taskTypes } from '../../models';

export enum FilterFields {
  ID = 'id',
  STATUS = 'statuses',
  TYPE = 'types',
  DATEFROM = 'dateFrom',
  DATEFTO= 'dateTo'
}

export const FilterFieldsTitle = {
  [FilterFields.ID]: "Номер заявки...",
  [FilterFields.STATUS]: "Статус",
  [FilterFields.TYPE]: "Тип",
  [FilterFields.DATEFROM]: "Дата создания"
};

export class TasksFilters {
  public static filterName = 'CommonTask';

  public static initDefaultFilters(): Filters {
    const filters: Filters = [];

    const inputFilter: InputFilter[] = [{
      type: FilterTypes.INPUT,
      placeholder: FilterFieldsTitle[FilterFields.ID],
      value: '',
      queryField: FilterFields.ID
    }
    ];

    const checkBoxFilter: CheckBoxFilter[] = [{
      type: FilterTypes.CHECKBOX,
      title: FilterFieldsTitle[FilterFields.STATUS],
      options: this.getCheckBoxesForFilter(CommonTaskStatus, [...defaultCommonTaskStatuses], commonTaskStatuses),
      checked: [],
      queryField: FilterFields.STATUS
    },
    {
      type: FilterTypes.CHECKBOX,
      title: FilterFieldsTitle[FilterFields.TYPE],
      options: this.getCheckBoxesForFilter(TaskTypes, [...defaultTaskTypes], taskTypes),
      checked: [],
      queryField: FilterFields.TYPE
    }];

    const dateFilter: DateFilter[] = [{
      type: FilterTypes.DATERANGE,
      title: FilterFieldsTitle[FilterFields.DATEFROM],
      dateFrom: FilterFields.DATEFROM,
      dateTo: FilterFields.DATEFTO,
      dateFromValue: '',
      dateToValue: ''
    }
  ];

    filters.push(...inputFilter, ...checkBoxFilter, ...dateFilter);

    return filters;
  }

  static getCheckBoxesForFilter(allCheckBoxes: Object, checked: string[], checkBoxesCaption: Object): CheckboxOption[] {
    return Object.values(allCheckBoxes).map((value: string) => ({
      value: value,
      checked: checked.includes(value),
      caption: checkBoxesCaption[value]
    }))
      .filter((option: CheckboxOption) => !!option.caption);
  }
}
