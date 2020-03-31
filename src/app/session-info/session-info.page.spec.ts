import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { SessionInfoPage } from './session-info.page';

describe('SessionInfoPage', () => {
  let component: SessionInfoPage;
  let fixture: ComponentFixture<SessionInfoPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SessionInfoPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(SessionInfoPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
