import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ParcelleInputPage } from './parcelle-input.page';

describe('ParcelleInputPage', () => {
  let component: ParcelleInputPage;
  let fixture: ComponentFixture<ParcelleInputPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ParcelleInputPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ParcelleInputPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
