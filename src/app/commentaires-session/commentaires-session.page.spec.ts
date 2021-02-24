import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { CommentairesSessionPage } from './commentaires-session.page';

describe('CommentairesSessionPage', () => {
  let component: CommentairesSessionPage;
  let fixture: ComponentFixture<CommentairesSessionPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CommentairesSessionPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(CommentairesSessionPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
