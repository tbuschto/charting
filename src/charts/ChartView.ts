import { AppStore, AppState } from "./App";
import { View } from "./View";
import { Chart, Scale } from 'chart.js';
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
        const point = dataSet.data[tooltip.index];
        if (typeof point !== 'number') {
          return (point.label || point.y || point) + '';
        }
        return point + '';
      }
    }
  },
  spanGaps: true,
  layout: {padding: 12},
  legend: {
    display: true,
    position: "bottom",
    labels: {
      filter: (item, data) => data.datasets[item.datasetIndex].data.length > 0
    }
  },
  maintainAspectRatio: false,
  scales: {
    xAxes: [{
      gridLines: {
        color: gray
      },
      ticks: {
        callback(this: Scale, value, index, values) {
          if (typeof value === 'number') {
            return this.chart.data.labels[value] as string;
          }
          return value;
        },
        fontColor: white,
        padding: 8,
        min: 0,
        maxTicksLimit: 10,
        maxRotation: 0
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

type ChartType = 'bar' | 'line' | 'bubble';

export class ChartView extends View<'div'> {

  private _chart: Chart;
  private _title: string = '';
  private _type: ChartType = null;
  private _canvas: View<'canvas'>;
  private _updatePending: boolean = false;
  private _data: Chart.ChartData = {};
  private _max: number = 10;


  constructor() {
    super('div', {id: 'chartwrapper'}, {
      backgroundColor: darkGray
    });
  }

  public set data(value: Chart.ChartData) {
    this._data = clone(value);
    this._update();
  }

  public get data() {
    return this._data;
  }

  public set type(value: ChartType) {
    this._type = value;
    this._update();
  }

  public get type() {
    return this._type;
  }

  public set title(value: string) {
    this._title = value;
    this._update();
  }

  public get title() {
    return this._title;
  }

  public set max(value) {
    if (this._max !== value) {
      this._max = value;
    }
    this._update();
  }

  public get max() {
    return this._max;
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
    console.log('CHART UPDATE');
    console.log(this._data);
    if (!this._data.datasets.length && !this._chart) {
      return;
    }
    if (this._chart && (this._type !== this._chart.config.type)) {
      this._clean();
      this._create();
    }
    if (!this._data.datasets.length && this._chart) {
      this._clean();
      return;
    }
    if (!this._chart && this._data.datasets.length) {
      this._create();
      return;
    }
    const realDataSetCount = this._chart.data.datasets.filter(dataset => dataset.data.length).length;
    const max = Math.max(this.data.datasets.length, this._chart.data.datasets.length);
    const allowAnimation = realDataSetCount === 0
      || this.data.datasets.length === realDataSetCount;
    // For animations to work the existing datasets may never be replaced or removed entirely
    for (let i = 0; i < max; i++) {
      if (this._chart.data.datasets[i] && this._data.datasets[i]) {
        Object.assign(this._chart.data.datasets[i], this._data.datasets[i]);
      } else if (!this._chart.data.datasets[i] && this._data.datasets[i]) {
        this._chart.data.datasets[i] = this._data.datasets[i];
      } else {
        this._chart.data.datasets[i].data = [];
      }
    }
    this._chart.data.labels = this._data.labels || [];
    this._updateOptions(this._chart.config.options);
    this._chart.update(allowAnimation ? 500 : 0);
  }

  private _updateTitle() {
    if (this._chart) {
      this._chart.config.options.title.text = this.title;
    }
  }

  private _create() {
    this._canvas = new View('canvas', {id: 'chart'});
    this.append(this._canvas);
    const options = clone(defaultOptions);
    options.onClick = (ev, elements) => {
      const el = elements as any;
      if (el && el[0] && typeof el[0]._datasetIndex === 'number'&& typeof el[0]._index === 'number') {
        const dataset = this._chart.data.datasets[el[0]._datasetIndex];
        if (dataset.data[el[0]._index] instanceof Object) {
          alert((dataset.data[el[0]._index] as any).message );
        }
      }
    };
    this._chart = new Chart(
      this._canvas.element.getContext('2d') as CanvasRenderingContext2D,
      {
        type: this._type,
        options: this._updateOptions(options),
        data: this._data
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

  private _updateOptions(options: Chart.ChartOptions) {
    options.scales.xAxes[0].ticks.max = this._data.labels.length - 1;
    if (this._max !== undefined) {
      options.scales.yAxes[0].ticks.max = this._max;
    } else {
      delete options.scales.yAxes[0].ticks.max;
    }
    return options;
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
      this.type = getChartType(state);
      this.max =
          state.yAxis === 'Count' ? undefined
        : state.yAxis === 'Percent' ? undefined
        : 10;
    });
  }

}

function getChartType(state: AppState): ChartType {
  if (state.xAxis === 'Years') {
    return state.yAxis === 'Distribution' ? 'bubble' : 'line';
  }
  if (state.xAxis === 'Decades' || state.xAxis === 'Genre') {
    return state.yAxis === 'Distribution' ? 'bubble' : 'bar';
  }
  return 'bar'
}
