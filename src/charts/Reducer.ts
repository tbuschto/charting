import {combineReducers} from 'redux';
import {AppState, User, XAxisMode, YAxisMode, Color, ItemTypes, UserLogic} from './App';
import {ActionType, Action} from './ActionCreators';
import {ImdbTable, ImdbItem} from './ImdbTableFactory';
import * as deepExtend from 'deep-extend';
import { YEAR_MIN, YEAR_MAX } from './ImdbTableToChartDataConverter';

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
    {
      imdbTable, users, userLogic, xAxis, yAxis, years, ratings,
      ratingsDiff, itemTypes, genres, reverse, animate, bezier, tableView
    }
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

function itemTypes(state: ItemTypes, action: Action): ItemTypes {
  if (action.type === ActionType.SetItemTypes) {
    return action.payload;
  }
  return state || {
    movie: true,
    tvMiniSeries: false,
    tvMovie: false,
    tvSeries: false,
    video: false,
    videoGame: false
  }
}

function genres(state: {[genre: string]: boolean}, action: Action): {[genre: string]: boolean} {
  if (action.type === ActionType.ClearTableData) {
    return {};
  }
  if (action.type === ActionType.SetGenres) {
    return action.payload;
  }
  if (action.type === ActionType.AddTableData) {
    const newGenre: {[genre: string]: boolean} = {};
    for (const id in action.payload.data) {
      action.payload.data[id].genre.forEach(genre => {
        newGenre[genre] = true;
      })
    }
    return Object.assign({}, state || {}, newGenre);
  }
  return state || {};
}

function userLogic(state: UserLogic, action: Action): UserLogic {
  if (action.type === ActionType.SetUserLogic) {
    return action.payload;
  }
  return state || 'OR';
}

function reverse(state: boolean, action: Action): boolean {
  if (action.type === ActionType.SetReverse) {
    return action.payload;
  }
  return !!state;
}

function animate(state: boolean, action: Action): boolean {
  if (action.type === ActionType.SetAnimate) {
    return action.payload;
  }
  return state === undefined ? true : state;
}

function bezier(state: boolean, action: Action): boolean {
  if (action.type === ActionType.SetBezier) {
    return action.payload;
  }
  return state === undefined ? true : state;
}

function years(state: [number, number], action: Action): [number, number] {
  let result = state ? state.concat() : [YEAR_MIN, YEAR_MAX];
  if (action.type === ActionType.SetYears) {
    result = action.payload.concat();
  }
  result[0] = Math.min(Math.max(result[0], YEAR_MIN), YEAR_MAX);
  result[1] = Math.min(Math.max(result[1], YEAR_MIN), YEAR_MAX);
  return [
    Math.min(result[0], result[1]),
    Math.max(result[0], result[1])
  ];
}

function ratings(state: [number, number], action: Action): [number, number] {
  let result = state ? state.concat() : [1, 10];
  if (action.type === ActionType.SetRatings) {
    result = action.payload.concat();
  }
  result[0] = Math.min(Math.max(result[0], 0), 10);
  result[1] = Math.min(Math.max(result[1], 0), 10);
  return [
    Math.min(result[0], result[1]),
    Math.max(result[0], result[1])
  ];
}

function ratingsDiff(state: [number, number], action: Action): [number, number] {
  let result = state ? state.concat() : [1, 10];
  if (action.type === ActionType.SetRatingsDiff) {
    result = action.payload.concat();
  }
  result[0] = Math.min(Math.max(result[0], 0), 9);
  result[1] = Math.min(Math.max(result[1], 0), 9);
  return [
    Math.min(result[0], result[1]),
    Math.max(result[0], result[1])
  ];
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

function tableView(state: ImdbItem[], action: Action) {
  if (action.type === ActionType.SetTableViewItems) {
    return action.payload;
  }
  return state || null;
}
