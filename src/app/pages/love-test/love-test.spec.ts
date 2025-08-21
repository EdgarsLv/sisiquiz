import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoveTest } from './love-test';

describe('LoveTest', () => {
  let component: LoveTest;
  let fixture: ComponentFixture<LoveTest>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoveTest]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LoveTest);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
