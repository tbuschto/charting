import {Store} from 'redux'
import {Chart} from 'chart.js'
import {Observable, from} from 'rxjs'
import {distinctUntilKeyChanged} from 'rxjs/operators'
import {ActionCreators} from './ActionCreators';
import {FileService} from './FileService';
import {ImdbTableFactory, ImdbTable} from './ImdbTableFactory';
import {Action} from './ActionCreators';

export interface AppState {
  showUserRatings: boolean;
  showImdbRatings: boolean;
  imdbTable: ImdbTable;
}

export type AppStore = Store<AppState, Action<any>> & {
  [Symbol.observable]: () => Observable<AppState>
};

export class App {

  constructor(
    private _store: AppStore,
    private _imdbTableFactory: ImdbTableFactory,
    private _fileService: FileService,
    private _actions: ActionCreators
  ) {}

  public async start() {
    const state = from(this._store);
    state.pipe(distinctUntilKeyChanged('imdbTable')).subscribe(({imdbTable}) => {
      if (imdbTable) {
        this.createChart(imdbTable);
      }
    })
    this._store.dispatch(this._actions.setImdbTable(await this.createTable()));
  }

  async createTable(): Promise<ImdbTable> {
    return this._imdbTableFactory.createTable(await this._fileService.getTextFiles());
  }

  createChart(table: ImdbTable): Chart {
    const chartContainer = document.createElement('div');
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;
    Object.assign(chartContainer.style, {width: '800px', height: '1200px'});
    chartContainer.append(canvas);
    document.body.append(chartContainer);
    const type: Chart.ChartType = 'scatter';
    return new Chart(ctx, {
      type,
      options: {
        title: {display: true, text: `${table.length} Titles`},
      },
      data: {
        datasets: [
          {
            data: table.map<Chart.ChartPoint>(item => ({
              x: item.release.getFullYear(),
              y: item.userRating
            }))
          }
        ]
      }
    });
  }

}
