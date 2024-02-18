import { Component, OnInit, ViewChild } from '@angular/core';
import { ChartConfiguration, ChartData, ChartEvent, ChartType } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
import { SharedModule } from '../../../../../../shared/shared.module';
import { valueOrDefault } from 'chart.js/helpers';
import colorLib from '@kurkle/color';
import { Store } from '@ngrx/store';
import { DashboardState } from '../../../../../../ngrx/dashboard/dashboard.state';

@Component({
  selector: 'app-user-chart',
  standalone: true,
  imports: [SharedModule],
  templateUrl: './user-chart.component.html',
  styleUrl: './user-chart.component.scss',
})
export class UserChartComponent implements OnInit {
  constructor(private store: Store<{ dashboard: DashboardState }>) {}

  dashboardDetail$ = this.store.select((state) => state.dashboard);

  @ViewChild(BaseChartDirective) chart: BaseChartDirective | undefined;
  public MONTHS = [];
  public CHART_COLORS: string[] = [
    'rgb(255, 99, 132)',
    'rgb(255, 159, 64)',
    'rgb(255, 205, 86)',
    'rgb(75, 192, 192)',
    'rgb(54, 162, 235)',
    'rgb(153, 102, 255)',
    'rgb(201, 203, 207)',
  ];
  public DATA_COUNT: number;
  public NUMBER_CFG: any = {};

  ngOnInit(): void {
    this.dashboardDetail$.subscribe((data) => {
      if (data.chart == '') {
        this.MONTHS = ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY'];
      } else {
        this.MONTHS = [
          'MONDAY',
          'TUESDAY',
          'WEDNESDAY',
          'THURSDAY',
          'FRIDAY',
          'SATURDAY',
          'SUNDAY',
        ];
      }
    });
    this.DATA_COUNT = this.MONTHS.length;
    this.NUMBER_CFG = { count: this.DATA_COUNT, min: 0, max: 100 };
    this.barChartOptions = {
      responsive: true,
      plugins: {
        legend: {
          display: false,
        },
      },
    };
    this.barChartType = 'line';
    this.barChartData = {
      labels: this.MONTHS,
      datasets: [
        {
          data: this.numbers(this.NUMBER_CFG),
          borderColor: this.CHART_COLORS[0],
          backgroundColor: this.transparentize(this.CHART_COLORS[0], 0.5),
        },
      ],
    };
    this.randomize();
  }

  public barChartOptions: ChartConfiguration['options'] = {};
  public barChartType: ChartType;
  public barChartData: ChartData<'line'>;

  transparentize(value, opacity) {
    var alpha = opacity === undefined ? 0.5 : 1 - opacity;
    return colorLib(value).alpha(alpha).rgbString();
  }

  public numbers(config) {
    var cfg = config || {};
    var min = valueOrDefault(cfg.min, 0);
    var max = valueOrDefault(cfg.max, 100);
    var from = valueOrDefault(cfg.from, []);
    var count = valueOrDefault(cfg.count, 8);
    var decimals = valueOrDefault(cfg.decimals, 8);
    var continuity = valueOrDefault(cfg.continuity, 1);
    var dfactor = Math.pow(10, decimals) || 0;
    var data = [];
    var i, value;

    for (i = 0; i < count; ++i) {
      value = (from[i] || 0) + this.rand(min, max);
      if (this.rand(min, max) <= continuity) {
        data.push(Math.round(dfactor * value) / dfactor);
      } else {
        data.push(null);
      }
    }
    return data;
  }

  public rand(min, max) {
    min = valueOrDefault(min, 0);
    max = valueOrDefault(max, 0);
    this._seed = (this._seed * 9301 + 49297) % 233280;
    return min + (this._seed / 233280) * (max - min);
  }

  _seed = Date.now();

  // events
  public chartClicked({
    event,
    active,
  }: {
    event?: ChartEvent;
    active?: object[];
  }): void {
    console.log(event, active);
  }

  public chartHovered({
    event,
    active,
  }: {
    event?: ChartEvent;
    active?: object[];
  }): void {
    console.log(event, active);
  }

  public randomize(): void {
    for (let i = 0; i < this.DATA_COUNT; i++) {
      this.barChartData.datasets[0].data[i] = Math.round(Math.random() * 100);
    }
    this.chart?.update();
  }
}