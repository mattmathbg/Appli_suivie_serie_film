import { ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ExploreContainerComponentModule } from '../explore-container/explore-container.module';

import { ExplorerPage } from './explorer.page';

describe('explorerPage', () => {
  let component: ExplorerPage;
  let fixture: ComponentFixture<ExplorerPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ExplorerPage],
      imports: [IonicModule.forRoot(), ExploreContainerComponentModule]
    }).compileComponents();

    fixture = TestBed.createComponent(ExplorerPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
