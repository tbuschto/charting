import { AppStore, AppState } from './App';
import { from } from 'rxjs';
import { distinctUntilKeyChanged } from 'rxjs/operators';

const KEY_TABLE = 'charts.Persistence.table';
const KEY_STATE = 'charts.Persistence.state';

export class Persistence {

  public static readState(defaultState: AppState) {
    let state = Object.assign({}, defaultState);
    const tableJson = localStorage.getItem(KEY_TABLE);
    const stateJson = localStorage.getItem(KEY_STATE);
    if (tableJson && stateJson) {
      try {
        state = Object.assign({}, state, JSON.parse(stateJson), {imdbTable: JSON.parse(tableJson)});
      } catch (ex) {
        console.warn('Could not restore state', ex);
      }
    }
    return state;
  }

  constructor(store: AppStore) {
    from(store).pipe(distinctUntilKeyChanged('imdbTable')).subscribe(this.saveImdbTable.bind(this));
    from(store).subscribe(this.saveState.bind(this));
  }

  private saveImdbTable({imdbTable}: AppState) {
    localStorage.setItem(KEY_TABLE, JSON.stringify(imdbTable));
  }

  private saveState(state: AppState) {
    const {imdbTable, ...remainingState} = state;
    localStorage.setItem(KEY_STATE, JSON.stringify(remainingState));
  }

}