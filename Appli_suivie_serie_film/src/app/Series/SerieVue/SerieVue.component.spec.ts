import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';

import { SerieVueComponent } from './SerieVue.component';

describe('SerieVueComponent', () => {
  let component: SerieVueComponent;
  let fixture: ComponentFixture<SerieVueComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SerieVueComponent],
      imports: [IonicModule.forRoot(), RouterModule.forRoot([])]
    }).compileComponents();

    fixture = TestBed.createComponent(SerieVueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
