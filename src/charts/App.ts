import { Store } from 'redux'
import { Observable, from } from 'rxjs'
import { distinctUntilKeyChanged } from 'rxjs/operators'
import { ImdbTable } from './ImdbTableFactory';
import { Action, AsyncAction } from './ActionCreators';
import { FilePicker } from './FilePicker';
import { View } from './View';
import { MainView } from './MainView';

export type Color = [number, number, number];
export type User = {name: string, color: Color, show: boolean};
export type XAxisMode = 'Timeline' | 'Years' | 'Decades';
export type YAxisMode = 'Distribution' | 'Average' | 'Median' | 'RT';

export interface AppState {
  xAxis: XAxisMode;
  yAxis: YAxisMode;
  users: User[];
  imdbTable: ImdbTable;
}

declare module 'redux' {
  interface Store { // Fix redux type declaration to work with rxjs
    [Symbol.observable]: () => Observable<AppState>
  }
}

export type AppStore = Store<AppState, Action> & {
  dispatch<R>(asyncAction: AsyncAction<R>): R
};

export class App {

  private _content?: View = null;

  constructor(
    public container: HTMLElement,
    private _store: AppStore,
    private _filePicker: FilePicker,
    private _mainView: MainView
  ) { }

  public async start() {
    const state = from(this._store);
    state.pipe(distinctUntilKeyChanged('imdbTable')).subscribe(({imdbTable}) => {
      if (Object.keys(imdbTable).length) {
        this.content = this._mainView;
      } else {
        this.content = this._filePicker;
      }
    });
  }

  public set content(value: View) {
    if (this._content === value) {
      return;
    }
    if (this._content) {
      this._content.element.remove();
    }
    this._content = value;
    this.container.appendChild(this._content.element)
  }

  public get content() {
    return this._content;
  }

}
