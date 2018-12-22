import { ImdbItem } from './ImdbTableFactory';
import { AppState } from './App';

export class ImdbItemFilter {

  filter(items: ImdbItem[], state: AppState): ImdbItem[] {
    return items
      .filter(item => state.itemTypes[item.type])
      .filter(item => this._userFilter(item, state))
      .filter(item => this._releaseFilter(item, state))
      .filter(item => this._ratingsFilter(item, state))
      .filter(item => item.genre.some(genre => state.genres[genre]));
  }

  private _releaseFilter(item: ImdbItem, state: AppState) {
    const year = yearOf(item.release);
    return year >= state.years[0] && year <= state.years[1];
  }

  private _ratingsFilter(item: ImdbItem, state: AppState) {
    const users = state.users.filter(user => user.show).map(user => user.name);
    const ratings = item.ratings;
    const range = state.ratings;
    for (const user of users) {
      if ((user in ratings) && (ratings[user] <= range[1]) && (ratings[user] >= range[0])) {
        return true;
      }
    }
    return false;
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

function yearOf(date: string): number {
  return new Date(date).getFullYear()
}