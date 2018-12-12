import { ImdbTable, ImdbTableFactory } from './ImdbTableFactory';

export enum ActionTypes {
  SHOW_USER_RATINGS, SHOW_IMDB_RATINGS, ADD_TABLE_DATA
}

export interface AddTableDataAction {
  type: ActionTypes.ADD_TABLE_DATA, payload: ImdbTable
}

export interface ShowUserRatingsAction {
  type: ActionTypes.SHOW_USER_RATINGS, payload: boolean
}

export interface ShowImdbRatingsAction {
  type: ActionTypes.SHOW_IMDB_RATINGS, payload: boolean
}

export type Action = AddTableDataAction | ShowImdbRatingsAction | ShowUserRatingsAction;

export class ActionCreators {

  constructor(
    private _imdbTableFactory: ImdbTableFactory
  ) {}

  public showUserRatings(payload: boolean): ShowUserRatingsAction {
    return { type: ActionTypes.SHOW_USER_RATINGS, payload }
  }
  ​
  public showImdbRatings(payload: boolean): ShowImdbRatingsAction  {
    return { type: ActionTypes.SHOW_IMDB_RATINGS, payload }
  }

  public addTableData(data: string): AddTableDataAction  {
    return {
      type: ActionTypes.ADD_TABLE_DATA,
      payload: this._imdbTableFactory.createTable(data)
    };
  }

}
