import { ImdbItem } from './ImdbTableFactory';
import { AppState } from './App';

export class ImdbItemFilter {

  filter(items: ImdbItem[], state: AppState): ImdbItem[] {
    return items
      .filter(item => state.itemTypes[item.type])
      .filter(item => this._userFilter(item, state))
      .filter(item => item.genre.some(genre => state.genres[genre]));
  }

  private _userFilter(item: ImdbItem, state: AppState) {
    const users = state.users.filter(user => user.show).map(user => user.name);
    if (users.length < 2) {
      return true;
    }
    if (state.userLogic === 'AND') {
      return users.every(user => user in item.ratings);
    }
    if (state.userLogic === 'XOR') {
      const haveRatings = users.filter(user => user in item.ratings).length;
      return (haveRatings > 0) && (haveRatings < users.length);
    }
    return users.some(user => user in item.ratings);
  }

}