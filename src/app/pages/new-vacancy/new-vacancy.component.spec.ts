import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewVacancyComponent } from './new-vacancy.component';

describe('NewVacancyComponent', () => {
  let component: NewVacancyComponent;
  let fixture: ComponentFixture<NewVacancyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NewVacancyComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NewVacancyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
