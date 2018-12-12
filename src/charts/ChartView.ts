import { AppStore } from "./App";
import { View } from "./View";
import { Chart } from 'chart.js';
import { ActionCreators } from "./ActionCreators";
import { from } from "rxjs";
import { distinctUntilKeyChanged } from "rxjs/operators";

export class ChartView extends View<'canvas'> {

  private _chart: Chart;
  private _updatePending: boolean = false;

  constructor() {
    super('canvas', {}, {maxWidth: '1600px', maxHeight: '800px'});
    this._chart = new Chart(
      this.element.getContext('2d') as CanvasRenderingContext2D,
      {
        type: 'scatter',
        options: {
          title: {display: true, text: 'foo'},
          legend: {display: false}
        },
        data: {
          datasets: [{data: [{x: 0, y: 0}, {x: 10, y: 10}]}]
        }
      }
    );
  }

  public set data(value: Chart.ChartDataSets[]) {
    this._chart.data.datasets = value;
    this._update();
  }

  public get data() {
    return this._chart.data.datasets;
  }

  public set title(value: string) {
    this._chart.config.options.title.text = value;
    this._update();
  }

  public get title() {
    return this._chart.config.options.title.text as string;
  }

  private _update() {
    if (!this._updatePending) {
      setTimeout(() => {
        this._chart.update();
        this._updatePending = false;
      }, 100);
      this._updatePending = true;
    }
  }

}

export class ImdbChart extends ChartView {

  constructor(
    store: AppStore,
    actions: ActionCreators
  ) {
    super();
    from(store).pipe(distinctUntilKeyChanged('imdbTable')).subscribe(({imdbTable}) => {
      if (!imdbTable.length) {
        return;
      }
      this.title = `${imdbTable.length} Titles`;
      this.data = [
        {
          data: imdbTable.map<Chart.ChartPoint>(item => ({
            x: item.release.getFullYear(),
            y: item.userRating
          }))
        }
      ]
    });
  }

}