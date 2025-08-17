import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IqTest } from './iq-test';

describe('IqTest', () => {
  let component: IqTest;
  let fixture: ComponentFixture<IqTest>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IqTest]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IqTest);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
