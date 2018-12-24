import { Store } from 'redux'
import { distinctUntilKeyChanged } from 'rxjs/operators'
import { ImdbTable, ItemType } from './ImdbTableFactory';
import { Action, AsyncAction } from './ActionCreators';
import { FilePicker } from './FilePicker';
import { View } from './View';
import { MainView } from './MainView';
import { from } from 'rxjs';

export type Color = [number, number, number];
export type User = {name: string, color: Color, show: boolean};
export type XAxisMode = 'Years' | 'Decades' | 'Genre' | 'Rating';
export type YAxisMode = 'Distribution' | 'Average' | 'Median' | 'RT' | 'Count' | 'Percent';
export type ItemTypes = { [type in ItemType]: boolean };
export type Genres = {[genre: string]: boolean};
export type UserLogic = 'AND' | 'OR' | 'XOR';

export interface AppState {
  itemTypes: ItemTypes;
  userLogic: UserLogic;
  genres: { [genre: string]: boolean };
  xAxis: XAxisMode;
  yAxis: YAxisMode;
  users: User[];
  years: [number, number];
  ratings: [number, number];
  ratingsDiff: [number, number];
  imdbTable: ImdbTable;
  reverse: boolean;
  animate: boolean;
  bezier: boolean;
}

const YEAR_MIN = 1920;
const YEAR_MAX = 2020;

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
