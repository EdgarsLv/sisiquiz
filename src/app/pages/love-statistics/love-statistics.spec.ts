import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoveStatistics } from './love-statistics';

describe('LoveStatistics', () => {
  let component: LoveStatistics;
  let fixture: ComponentFixture<LoveStatistics>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoveStatistics]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LoveStatistics);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
