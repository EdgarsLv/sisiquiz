import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SociotypeChart } from './sociotype-chart';

describe('SociotypeChart', () => {
  let component: SociotypeChart;
  let fixture: ComponentFixture<SociotypeChart>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SociotypeChart]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SociotypeChart);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
