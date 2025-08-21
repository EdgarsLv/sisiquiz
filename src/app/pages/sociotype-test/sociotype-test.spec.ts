import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SociotypeTest } from './sociotype-test';

describe('SociotypeTest', () => {
  let component: SociotypeTest;
  let fixture: ComponentFixture<SociotypeTest>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SociotypeTest]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SociotypeTest);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
