import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SociotypeStatistics } from './sociotype-statistics';

describe('SociotypeStatistics', () => {
  let component: SociotypeStatistics;
  let fixture: ComponentFixture<SociotypeStatistics>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SociotypeStatistics]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SociotypeStatistics);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
