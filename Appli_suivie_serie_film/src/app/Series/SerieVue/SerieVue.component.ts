import { ChangeDetectionStrategy, Component, inject, Input } from '@angular/core';
import { Platform } from '@ionic/angular';
import { DataSerieModel } from '../../models/data-serie.model';

@Component({
  selector: 'app-vue-serie',
  templateUrl: './SerieVue.component.html',
  styleUrls: ['./SerieVue.component.scss'],
  standalone: false,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SerieVueComponent {
  private platform = inject(Platform);
  @Input() Serie?: DataSerieModel;
  isIos() {
    return this.platform.is('ios')
  }
}
