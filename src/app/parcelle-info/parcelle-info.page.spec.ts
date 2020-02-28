import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ParcelleInfoPage } from './parcelle-info.page';

describe('ParcelleInfoPage', () => {
  let component: ParcelleInfoPage;
  let fixture: ComponentFixture<ParcelleInfoPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ParcelleInfoPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ParcelleInfoPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
