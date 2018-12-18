import { AppStore } from "./App";
import { View } from "./View";
import { Chart } from 'chart.js';
import { ActionCreators } from "./ActionCreators";
import { from } from "rxjs";
import { ImdbTableToChartDataConverter } from './ImdbTableToChartDataConverter';
import * as clone from 'clone';

const darkGray = 'rgb(51, 51, 51)'
const white = 'rgb(220, 220, 220)';
const lightGray = 'rgb(140, 140, 140)';
const gray = 'rgb(80, 80, 80)';

const defaultOptions: Chart.ChartOptions = {
  title: {
    display: true,
    text: '',
    fontColor: white,
    fontSize: 24,
  },
  tooltips: {
    callbacks: {
      label: (tooltip, data) => {
        const dataSet = data.datasets[tooltip.datasetIndex];
        const point = dataSet.data[tooltip.index] as any;
        return (point.label || point.y || point) + '';
      }
    }
  },
  layout: {padding: 12},
  legend: {display: false},
  maintainAspectRatio: false,
  scales: {
    xAxes: [{
      gridLines: {
        color: gray,
      },
      ticks: {
        fontColor: white,
        padding: 8
      }
    }],
    yAxes: [{
      ticks: {
        beginAtZero: true,
         fontColor: white,
        padding: 8
      },
      gridLines: {
        color: gray,
        zeroLineColor: lightGray
      }
    }]
  },
  elements: {
    point: {
      backgroundColor: white,
      borderColor: gray
    }
  }
};

export class ChartView extends View<'div'> {

  private _chart: Chart;
  private _title: string ='';
  private _canvas: View<'canvas'>;
  private _updatePending: boolean = false;
  private _data: Chart.ChartDataSets[] = [];;

  constructor() {
    super('div', {id: 'chartwrapper'}, {
      backgroundColor: darkGray
    });
  }

  public set data(value: Chart.ChartDataSets[]) {
    this._data = clone(value);
    this._update();
  }

  public get data() {
    return this._data;
  }

  public set title(value: string) {
    this._title = value;
    this._update();
  }

  public get title() {
    return this._title;
  }

  private _update() {
    // Collect updates, also ensures parent is in DOM
    if (!this._updatePending) {
      setTimeout(() => {
        this._updateChart();
        this._updateTitle();
        this._updatePending = false;
      }, 100);
      this._updatePending = true;
    }
  }

  private _updateChart() {
    if (!this._data.length && !this._chart) {
      return;
    }
    if (!this._data.length && this._chart) {
      this._clean();
      return;
    }
    if (!this._chart && this._data.length) {
      this._create();
      return;
    }
    (this._chart as any).reset();
    const max = Math.max(this.data.length, this._chart.data.datasets.length);
    // For animations to work the existing datasets may never be replaced or removed entirely
    for (let i = 0; i < max; i++) {
      if (this._chart.data.datasets[i] && this._data[i]) {
        Object.assign(this._chart.data.datasets[i], this._data[i]);
      } else if (!this._chart.data.datasets[i] && this._data[i]) {
        this._chart.data.datasets[i] = this._data[i];
      } else {
        this._chart.data.datasets[i].data = [];
      }
    }
    this._chart.update();
  }

  private _updateTitle() {
    if (this._chart) {
      this._chart.config.options.title.text = this.title;
    }
  }

  private _create() {
    this._canvas = new View('canvas', {id: 'chart'});
    this.append(this._canvas);
    this._chart = new Chart(
      this._canvas.element.getContext('2d') as CanvasRenderingContext2D,
      {
        type: 'scatter',
        options: clone(defaultOptions),
        data: {
          datasets: this.data
        }
      }
    );
  }

  private _clean() {
    if (this._canvas) {
      this._chart.destroy();
      this._chart = null;
      this._canvas.element.remove();
      this._canvas = null;
    }
  }

}

export class ImdbChart extends ChartView {

  constructor(
    store: AppStore,
    actions: ActionCreators,
    converter: ImdbTableToChartDataConverter
  ) {
    super();
    from(store).subscribe(state => {
      this.title = `${Object.keys(state.imdbTable).length} Titles`;
      this.data = converter.convert(state);
    });
  }

}