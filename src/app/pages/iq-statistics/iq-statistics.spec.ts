import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IqStatistics } from './iq-statistics';

describe('IqStatistics', () => {
  let component: IqStatistics;
  let fixture: ComponentFixture<IqStatistics>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IqStatistics]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IqStatistics);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
