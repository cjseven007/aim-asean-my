import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoginRequiredPage } from './login-required-page';

describe('LoginRequiredPage', () => {
  let component: LoginRequiredPage;
  let fixture: ComponentFixture<LoginRequiredPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoginRequiredPage]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LoginRequiredPage);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
