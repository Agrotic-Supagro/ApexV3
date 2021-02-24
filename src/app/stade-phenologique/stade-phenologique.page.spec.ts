import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { StadePhenologiquePage } from './stade-phenologique.page';

describe('StadePhenologiquePage', () => {
  let component: StadePhenologiquePage;
  let fixture: ComponentFixture<StadePhenologiquePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StadePhenologiquePage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(StadePhenologiquePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
