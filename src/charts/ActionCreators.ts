import { ImdbTable, ImdbTableFactory } from './ImdbTableFactory';

export enum ActionTypes {
  SHOW_USER_RATINGS, SHOW_IMDB_RATINGS, ADD_TABLE_DATA
}

export interface Action<Payload = never> {
  type: ActionTypes,
  payload?: Payload
}

export class ActionCreators {

  constructor(
    private _imdbTableFactory: ImdbTableFactory
  ) {}

  public showUserRatings(): Action<boolean> {
    return { type: ActionTypes.SHOW_USER_RATINGS }
  }
  ​
  public showImdbRatings(): Action<boolean>  {
    return { type: ActionTypes.SHOW_IMDB_RATINGS }
  }

  public addTableData(data: string): Action<ImdbTable>  {
    return { type: ActionTypes.ADD_TABLE_DATA, payload: this._imdbTableFactory.createTable(data) };
  }

}
