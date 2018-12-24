import { ImdbItem } from './ImdbTableFactory';
import { AppState } from './App';
import { yearOf, inRange } from './util';

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
    let result = false;
    for (const user of users) {
     result = result || inRange(item.ratings[user], state.ratings);
    }
    result = result && this._getRatingDiffs(users, item.ratings).some(diff => inRange(diff, state.ratingsDiff));
    return result;
  }

  private _getRatingDiffs(users: string[], ratings: {[user: string]: number}): number[] {
    const diffs: number[] = [];
    users.forEach(user1 => users.forEach(user2 => {
      if (user1 !== user2) {
        diffs.push(Math.abs(ratings[user1] - ratings[user2]));
      }
    }));
    return diffs;
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
