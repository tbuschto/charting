import { AppStore } from "./App";
import { View } from "./View";
import { Chart } from 'chart.js';
import { ActionCreators } from "./ActionCreators";
import { from, VirtualTimeScheduler } from "rxjs";
import { distinctUntilKeyChanged } from "rxjs/operators";
import { ImdbTableToChartDataConverter } from './ImdbTableToChartDataConverter';
import * as clone from 'clone';

export class ChartView extends View<'div'> {

  private _chart: Chart;
  private _title: string ='';
  private _canvas: View<'canvas'>;
  private _updatePending: boolean = false;
  private _data: Chart.ChartDataSets[] = [];;

  constructor() {
    super('div', {}, {maxWidth: '1600px', maxHeight: '800px'});
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
    const max = Math.max(this.data.length, this._chart.data.datasets.length);
    // For animations to work the existing datasets may never be replaced or removed entirely
    for (let i = 0; i < max; i++) {
      if (this._chart.data.datasets[i] && this._data[i]) {
        this._chart.data.datasets[i].data = this._data[i].data;
      } else if (!this._chart.data.datasets[i] && this._data[i]) {
        this._chart.data.datasets[i] = this._data[i];
      } else {
        delete this._chart.data.datasets[i].data;
      }
    }
    this._chart.update();
  }

  private _create() {
    this._canvas = new View('canvas', {id: Math.random()+ ''});
    this.append(this._canvas);
    this._chart = new Chart(
      this._canvas.element.getContext('2d') as CanvasRenderingContext2D,
      {
        type: 'scatter',
        options: {
          title: {display: true, text: 'foo'},
          legend: {display: false}
        },
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
      this.title = `${state.imdbTable.length} Titles`;
      this.data = converter.convert(state);
    });
  }

}