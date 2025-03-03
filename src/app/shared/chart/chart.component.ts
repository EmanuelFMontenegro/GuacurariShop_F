import { Component, Input } from '@angular/core';
import { ChartDataset, ChartOptions } from 'chart.js';

@Component({
  selector: 'app-chart',
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.scss']
})
export class ChartComponent {
  @Input() data: any;
  @Input() labels: any;
  @Input() options: any;
  @Input() chartOptions: any;
  @Input() type: string = 'line';
  @Input() colors: string = 'rgba(33, 150, 243, 0.2)';

  constructor() {}
}
