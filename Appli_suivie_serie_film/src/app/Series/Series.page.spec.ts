import { ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ExploreContainerComponentModule } from '../explore-container/explore-container.module';

import {SeriesPage} from "./Series.page";

describe('Series', () => {
  let component: SeriesPage;
  let fixture: ComponentFixture<SeriesPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SeriesPage],
      imports: [IonicModule.forRoot(), ExploreContainerComponentModule]
    }).compileComponents();

    fixture = TestBed.createComponent(SeriesPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
