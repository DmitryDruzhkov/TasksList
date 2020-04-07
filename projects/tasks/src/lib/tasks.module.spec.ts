import { async, TestBed } from '@angular/core/testing';
import { TasksModule } from './domains-tasks.module';

describe('TasksModule', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [TasksModule]
    }).compileComponents();
  }));

  it('should create', () => {
    expect(TasksModule).toBeDefined();
  });
});
