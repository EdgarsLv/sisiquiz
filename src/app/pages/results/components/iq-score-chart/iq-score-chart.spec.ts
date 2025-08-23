import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IqScoreChart } from './iq-score-chart';

describe('IqScoreChart', () => {
  let component: IqScoreChart;
  let fixture: ComponentFixture<IqScoreChart>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IqScoreChart]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IqScoreChart);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
