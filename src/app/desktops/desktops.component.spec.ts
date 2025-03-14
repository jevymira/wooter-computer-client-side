import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DesktopsComponent } from './desktops.component';

describe('DesktopsComponent', () => {
  let component: DesktopsComponent;
  let fixture: ComponentFixture<DesktopsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DesktopsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DesktopsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
