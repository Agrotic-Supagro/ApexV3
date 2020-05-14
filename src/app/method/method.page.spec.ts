import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { MethodPage } from './method.page';

describe('MethodPage', () => {
  let component: MethodPage;
  let fixture: ComponentFixture<MethodPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MethodPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(MethodPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
