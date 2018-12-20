import { AppStore } from "./App";
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
        callback(value, index, values) {
          return (this as Scale).chart.data.labels[value] as string;
        },
        fontColor: white,
        padding: 8,
        min: 0
      }
    }],
    yAxes: [{
      ticks: {
        beginAtZero: true,
        max: 10,
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
  private _data: Chart.ChartData = {};


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
    console.log('CHART UPDATE');
    console.log(this._data);
    if (!this._data.datasets.length && !this._chart) {
      return;
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
    this._chart.config.options.scales.xAxes[0].ticks.max = this._data.labels.length - 1;
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
    options.scales.xAxes[0].ticks.max = this._data.labels.length - 1;
    this._chart = new Chart(
      this._canvas.element.getContext('2d') as CanvasRenderingContext2D,
      {
        type: 'bubble',
        options: options,
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
