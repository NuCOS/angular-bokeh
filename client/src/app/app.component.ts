import { Component } from '@angular/core';
import { BokehChartComponent } from './shared/components/bokeh-chart/bokeh-chart.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    BokehChartComponent
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'bokeh-app';
}
