import { ImdbTable, ImdbTableFactory } from './ImdbTableFactory';
import { TextFile } from './FilePicker';
import { ThunkAction } from 'redux-thunk';
import { AppState, XAxisMode, YAxisMode, ItemTypes, UserLogic, Genres } from './App';

export enum ActionType {
  ShowUserRatings = 'SHOW_USER_RATINGS',
  ShowImdbRatings = 'SHOW_IMDB_RATINGS',
  AddTableData = 'ADD_TABLE_DATA',
  ClearTableData = 'CLEAR_TABLE_DATA',
  SetXAxisMode = 'SET_X_AXIS_MODE',
  SetYAxisMode = 'SET_Y_AXIS_MODE',
  SetItemTypes = 'SET_ITEM_TYPES',
  SetUserLogic = 'SET_USER_LOGIC',
  SetReverse = 'SET_REVERSE',
  SetAnimate = 'SET_ANIMATE',
  SetBezier = 'SET_BEZIER',
  SetGenres = 'SET_GENRES',
  SetYears = 'SET_YEARS',
  SetRatings = 'SET_RATINGS',
  SetRatingsDiff = 'SET_RATINGS_DIFF'
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
type SetReverse = ActionBase<typeof ActionType.SetReverse, boolean>;
type SetAnimate = ActionBase<typeof ActionType.SetAnimate, boolean>;
type SetBezier = ActionBase<typeof ActionType.SetBezier, boolean>;
type SetGenres = ActionBase<typeof ActionType.SetGenres, Genres>;
type SetYears = ActionBase<typeof ActionType.SetYears, [number, number]>;
type SetRatings = ActionBase<typeof ActionType.SetRatings, [number, number]>;
type SetRatingsDiff = ActionBase<typeof ActionType.SetRatingsDiff, [number, number]>;

export type Action = AddTableData
  | ShowUserRatings
  | ClearTableData
  | SetXAxisMode
  | SetYAxisMode
  | SetItemTypes
  | SetUserLogic
  | SetReverse
  | SetAnimate
  | SetBezier
  | SetGenres
  | SetYears
  | SetRatings
  | SetRatingsDiff;

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

  public setXAxisMode(payload: XAxisMode): AsyncAction {
    return (dispatch, getState) => {
      const state = getState();
      if (payload === 'Rating' && state.yAxis !== 'Percent' && state.yAxis !== 'Count') {
        dispatch({type: ActionType.SetYAxisMode, payload: 'Count'});
      }
      dispatch({type: ActionType.SetXAxisMode, payload});
    };
  }

  public setYAxisMode(payload: YAxisMode): AsyncAction {
    return (dispatch, getState) => {
      const state = getState();
      dispatch({type: ActionType.SetYAxisMode, payload});
      if (state.xAxis === 'Rating' && payload !== 'Percent' && payload !== 'Count') {
        dispatch({type: ActionType.SetYAxisMode, payload: state.yAxis});
      }
    };
  }

  public setItemTypes(payload: ItemTypes): SetItemTypes {
    return {type: ActionType.SetItemTypes, payload};
  }

  public setUserLogic(payload: UserLogic): SetUserLogic {
    return {type: ActionType.SetUserLogic, payload};
  }

  public setReverse(payload: boolean): SetReverse {
    return {type: ActionType.SetReverse, payload};
  }

  public setAnimate(payload: boolean): SetAnimate {
    return {type: ActionType.SetAnimate, payload};
  }

  public setBezier(payload: boolean): SetBezier {
    return {type: ActionType.SetBezier, payload};
  }

  public setGenres(payload: Genres): SetGenres {
    return {type: ActionType.SetGenres, payload};
  }

  public setYears(payload: [number, number]): SetYears {
    return {type: ActionType.SetYears, payload};
  }

  public setRatings(payload: [number, number]): SetRatings {
    return {type: ActionType.SetRatings, payload};
  }

  public setRatingsDiff(payload: [number, number]): SetRatingsDiff {
    return {type: ActionType.SetRatingsDiff, payload};
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
