import { ImdbTable, ImdbTableFactory } from './ImdbTableFactory';

export enum ActionType {
  ShowUserRatings = 'SHOW_USER_RATINGS',
  ShowImdbRatings = 'SHOW_IMDB_RATINGS',
  AddTableData = 'ADD_TABLE_DATA',
  ClearTableData = 'CLEAR_TABLE_DATA',
}

type ActionBase<T extends string, Payload = void> = {type: T, payload?: Payload};
type AddTableData = ActionBase<typeof ActionType.AddTableData, ImdbTable>;
type ShowImdbRatings = ActionBase<typeof ActionType.ShowImdbRatings, boolean>;
type ShowUserRatings = ActionBase<typeof ActionType.ShowUserRatings, boolean>;
type ClearTableData = ActionBase<typeof ActionType.ClearTableData>;

export type Action = AddTableData | ShowImdbRatings | ShowUserRatings | ClearTableData;

export class ActionCreators {

  constructor(
    private _imdbTableFactory: ImdbTableFactory
  ) { }

  public showUserRatings(payload: boolean): ShowUserRatings {
    return { type: ActionType.ShowUserRatings, payload }
  }
  ​
  public showImdbRatings(payload: boolean): ShowImdbRatings  {
    return { type: ActionType.ShowImdbRatings, payload }
  }

  public addTableData(data: string): AddTableData  {
    return {
      type: ActionType.AddTableData,
      payload: this._imdbTableFactory.createTable(data)
    };
  }

  public clearTableData(): ClearTableData  {
    return {type: ActionType.ClearTableData};
  }

}
