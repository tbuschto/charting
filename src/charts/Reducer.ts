import {combineReducers} from 'redux';
import {AppState} from './App';
import {Action, ActionTypes} from './ActionCreators';
import {ImdbTable} from './ImdbTableFactory';

export class Reducer {

  public readonly chartsApp = combineReducers<AppState, Action>(
    {showUserRatings, showImdbRatings, imdbTable}
  );

}

function showUserRatings(state: boolean, action: Action): boolean {
  if (state === undefined) {
    return null;
  }
  return action.type === ActionTypes.SHOW_USER_RATINGS ? !state : state;
}

function showImdbRatings(state: boolean, action: Action): boolean {
  if (state === undefined) {
    return null;
  }
  return action.type === ActionTypes.SHOW_IMDB_RATINGS ? !state : state;
}

function imdbTable(state: ImdbTable, action: Action): ImdbTable {
  if (action.type ===  ActionTypes.ADD_TABLE_DATA) {
    return action.payload;
  }
  return state || [];
}
