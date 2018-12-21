import { ImdbTable, ImdbTableFactory } from './ImdbTableFactory';
import { TextFile } from './FilePicker';
import { ThunkAction } from 'redux-thunk';
import { AppState, XAxisMode, YAxisMode, ItemTypes, UserLogic } from './App';

export enum ActionType {
  ShowUserRatings = 'SHOW_USER_RATINGS',
  ShowImdbRatings = 'SHOW_IMDB_RATINGS',
  AddTableData = 'ADD_TABLE_DATA',
  ClearTableData = 'CLEAR_TABLE_DATA',
  SetXAxisMode = 'SET_X_AXIS_MODE',
  SetYAxisMode = 'SET_Y_AXIS_MODE',
  SetItemTypes = 'SET_ITEM_TYPES',
  SetUserLogic = 'SET_USER_LOGIC'
}

export type UserSelection = {[user: string]: boolean};

type ActionBase<T extends string, Payload = void> = {type: T, payload?: Payload};
type AddTableData = ActionBase<typeof ActionType.AddTableData, {userName: string, data: ImdbTable}>;
type ShowUserRatings = ActionBase<typeof ActionType.ShowUserRatings, UserSelection>;
type ClearTableData = ActionBase<typeof ActionType.ClearTableData>;
type SetXAxisMode = ActionBase<typeof ActionType.SetXAxisMode, XAxisMode>;
type SetYAxisMode = ActionBase<typeof ActionType.SetYAxisMode, YAxisMode>;
type SetItemTypes = ActionBase<typeof ActionType.SetItemTypes, ItemTypes>;
type SetUserLogic = ActionBase<typeof ActionType.SetUserLogic, UserLogic>;

export type Action = AddTableData
  | ShowUserRatings
  | ClearTableData
  | SetXAxisMode
  | SetYAxisMode
  | SetItemTypes
  | SetUserLogic;

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

  public setXAxisMode(payload: XAxisMode): SetXAxisMode {
    return {type: ActionType.SetXAxisMode, payload};
  }

  public setYAxisMode(payload: YAxisMode): SetYAxisMode {
    return {type: ActionType.SetYAxisMode, payload};
  }

  public setItemTypes(payload: ItemTypes): SetItemTypes {
    return {type: ActionType.SetItemTypes, payload};
  }

  public setUserLogic(payload: UserLogic): SetUserLogic {
    return {type: ActionType.SetUserLogic, payload};
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
