import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoveLanguageChart } from './love-language-chart';

describe('LoveLanguageChart', () => {
  let component: LoveLanguageChart;
  let fixture: ComponentFixture<LoveLanguageChart>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoveLanguageChart]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LoveLanguageChart);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
