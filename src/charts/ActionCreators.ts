import { ImdbTable, ImdbTableFactory } from './ImdbTableFactory';
import { TextFile } from './FilePicker';
import { ThunkAction } from 'redux-thunk';
import { AppState } from './App';

export enum ActionType {
  ShowUserRatings = 'SHOW_USER_RATINGS',
  ShowImdbRatings = 'SHOW_IMDB_RATINGS',
  AddTableData = 'ADD_TABLE_DATA',
  ClearTableData = 'CLEAR_TABLE_DATA',
}

export type UserSelection = {[user: string]: boolean};

type ActionBase<T extends string, Payload = void> = {type: T, payload?: Payload};
type AddTableData = ActionBase<typeof ActionType.AddTableData, {userName: string, data: ImdbTable}>;
type ShowUserRatings = ActionBase<typeof ActionType.ShowUserRatings, UserSelection>;
type ClearTableData = ActionBase<typeof ActionType.ClearTableData>;

export type Action = AddTableData | ShowUserRatings | ClearTableData;

export type AsyncAction<R = Promise<void>|void> = ThunkAction<
  R,
  AppState,
  void,
  Action
>;

export class ActionCreators {

  constructor(
    private _imdbTableFactory: ImdbTableFactory
  ) { }

  public showUserRatings(payload: UserSelection): ShowUserRatings {
    return {type: ActionType.ShowUserRatings, payload}
  }
  ​
  public addFiles(files: TextFile[]): AsyncAction {
    return dispatch => {
      return files.forEach(file => {
        const userName = file.name.split('.').shift();
        dispatch(this.addIMDbTableData(
          userName,
          this._imdbTableFactory.createTable(userName, file.content)
        ))
      });
    }
  }

  public addIMDbTableData(userName: string, data: ImdbTable): AddTableData  {
    return {
      type: ActionType.AddTableData,
      payload: {userName, data}
    };
  }

  public clearTableData(): ClearTableData  {
    return {type: ActionType.ClearTableData};
  }

}
