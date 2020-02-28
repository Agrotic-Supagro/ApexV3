import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ParcelleApexPage } from './parcelle-apex.page';

describe('ParcelleApexPage', () => {
  let component: ParcelleApexPage;
  let fixture: ComponentFixture<ParcelleApexPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ParcelleApexPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ParcelleApexPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
