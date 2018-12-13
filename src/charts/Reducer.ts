import {combineReducers} from 'redux';
import {AppState} from './App';
import {ActionType, Action} from './ActionCreators';
import {ImdbTable} from './ImdbTableFactory';

export class Reducer {

  public readonly chartsApp = combineReducers<AppState, Action>(
    {showUserRatings, showImdbRatings, imdbTable}
  );

}

function showUserRatings(state: boolean, action: Action): boolean {
  return action.type === ActionType.ShowUserRatings ? action.payload : !!state;
}

function showImdbRatings(state: boolean, action: Action): boolean {
  return action.type === ActionType.ShowImdbRatings ? action.payload : !!state;
}

function imdbTable(state: ImdbTable, action: Action): ImdbTable {
  if (action.type === ActionType.AddTableData) {
    return action.payload;
  }
  if (action.type === ActionType.ClearTableData) {
    return [];
  }
  return state || [];
}
