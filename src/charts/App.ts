import { Store } from 'redux'
import { Observable, from } from 'rxjs'
import { distinctUntilKeyChanged } from 'rxjs/operators'
import { ImdbTable } from './ImdbTableFactory';
import { Action } from './ActionCreators';
import { ImdbChart } from './ChartView';
import { FilePicker } from './FilePicker';
import { View } from './View';

export interface AppState {
  showUserRatings: boolean;
  showImdbRatings: boolean;
  imdbTable: ImdbTable;
}

declare module 'redux' {
  interface Store { // Fix redux type declaration to work with rxjs
    [Symbol.observable]: () => Observable<AppState>
  }
}

export type AppStore = Store<AppState, Action>;

export class App {

  private _mainView: View = null;

  constructor(
    public container: HTMLElement,
    private _store: AppStore,
    private _filePicker: FilePicker,
    private _imdbChart: ImdbChart
  ) { }

  public async start() {
    const state = from(this._store);
    state.pipe(distinctUntilKeyChanged('imdbTable')).subscribe(({imdbTable}) => {
      if (imdbTable && imdbTable.length) {
        this.mainView = this._imdbChart;
      } else {
        this.mainView = this._filePicker;
      }
    });
  }

  public set mainView(value: View) {
    if (this._mainView === value) {
      return;
    }
    if (this._mainView) {
      this._mainView.element.remove();
    }
    this._mainView = value;
    this.container.appendChild(this._mainView.element)
  }

  public get mainView() {
    return this._mainView;
  }

}
