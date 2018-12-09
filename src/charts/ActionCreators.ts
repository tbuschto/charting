import {ImdbTable} from './ImdbTableFactory';

export interface Action<Payload = never> {
  type: 'TOGGLE_USER_RATINGS' | 'TOGGLE_IMDB_RATINGS' |'SET_IMDB_TABLE',
  payload?: Payload
}

export class ActionCreators {

  public toggleUserRatings(): Action {
    return { type: 'TOGGLE_USER_RATINGS' }
  }
  ​
  public toggleImdbRatings(): Action  {
    return { type: 'TOGGLE_IMDB_RATINGS' }
  }

  public setImdbTable(payload: ImdbTable): Action<ImdbTable>  {
    return { type: 'SET_IMDB_TABLE', payload };
  }

}
