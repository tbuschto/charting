import {combineReducers} from 'redux';
import {AppState, User, XAxisMode, YAxisMode, Color} from './App';
import {ActionType, Action} from './ActionCreators';
import {ImdbTable} from './ImdbTableFactory';
import * as deepExtend from 'deep-extend';

const COLOR_GENERIC: Color = [2, 172, 211];
const COLORS: Color[] = [
  [66, 104, 241],
  [250, 30, 30],
  [30, 255, 30]
];
const USER_IMDb: User = {
  name: 'IMDb',
  color: [245, 197, 24],
  show: true
};

export class Reducer {

  public readonly chartsApp = combineReducers<AppState, Action>(
    {imdbTable, users, xAxis, yAxis}
  );

}

function xAxis(state: XAxisMode = 'Years', action: Action): XAxisMode {
  if (action.type === ActionType.SetXAxisMode) {
    return action.payload;
  }
  return state;
}

function yAxis(state: YAxisMode = 'Distribution', action: Action): YAxisMode {
  if (action.type === ActionType.SetYAxisMode) {
    return action.payload;
  }
  return state;
}

function imdbTable(state: ImdbTable, action: Action): ImdbTable {
  if (action.type === ActionType.ClearTableData) {
    return {};
  }
  if (action.type === ActionType.AddTableData) {
    return deepExtend({}, state, action.payload.data);
  }
  return state || {};
}

function users(state: User[], action: Action): User[] {
  if (action.type === ActionType.ClearTableData || !state || !state.length) {
    return [USER_IMDb];
  }
  if (action.type === ActionType.AddTableData && !state.some(user => user.name === action.payload.userName)) {
    return state.concat([{
      name: action.payload.userName, color: COLORS[state.length - 1] || COLOR_GENERIC, show: true
    }]);
  }
  if (action.type === ActionType.ShowUserRatings) {
    return state.map(user => {
      if (user.show != action.payload[user.name]) {
        return Object.assign({}, user, {show: !!action.payload[user.name]});
      }
      return user;
    })
  }
  return state;
}
