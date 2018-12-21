enum Column {
  Id = 'Const',
  UserRating = 'Your Rating',
  Title = 'Title',
  Type = 'Title Type',
  Rating = 'IMDb Rating',
  Genre = 'Genres',
  Release = 'Release Date'
}

export type ItemType = 'movie' | 'tvMovie' | 'video' | 'tvSeries' | 'videoGame' | 'tvMiniSeries';

export interface ImdbItem {
  id: string,
  type: ItemType,
  ratings: {IMDb: number, [user: string]: number}
  title: string;
  genre: string[];
  release: string;
}

export type ImdbTable = {[id: string]: ImdbItem};

export class ImdbTableFactory {

  createTable(user: string, data: string): ImdbTable {
    const rows = data.trim().split('\n');
    const factory = new ImdbItemFactory(user, rows.shift());
    const table: ImdbTable = {};
    rows.map(row => factory.createItem(row)).forEach(item => {
      table[item.id] = item;
    })
    return table;
  }

}

class ImdbItemFactory {

  private _idIndex: number;
  private _userRatingIndex: number;
  private _titleIndex: number;
  private _ratingIndex: number;
  private _genreIndex: number;
  private _releaseIndex: number;
  private _typeIndex: number;
  private _user: string;

  constructor(user: string, headerLine: string) {
    this._user = user;
    const columns = headerLine.split(',');
    this._idIndex = columns.indexOf(Column.Id);
    this._userRatingIndex = columns.indexOf(Column.UserRating);
    this._titleIndex = columns.indexOf(Column.Title);
    this._ratingIndex = columns.indexOf(Column.Rating);
    this._genreIndex = columns.indexOf(Column.Genre);
    this._releaseIndex = columns.indexOf(Column.Release);
    this._typeIndex = columns.indexOf(Column.Type);
  }

  public createItem(row: string): ImdbItem {
    const parts = row.split(/,?",?/);
    let data: string[] = []
    for (let i = 0; i < parts.length; i++) {
      if (i % 2 === 0) {
        data = data.concat(parts[i].split(','));
      } else {
        data.push(parts[i]);
      }
    }
    return {
      id: data[this._idIndex],
      title: data[this._titleIndex],
      genre: data[this._genreIndex].split(',').map(str => str.trim()),
      ratings: {
        IMDb: parseFloat(data[this._ratingIndex]),
        [this._user]: parseFloat(data[this._userRatingIndex]),
      },
      release: data[this._releaseIndex],
      type: data[this._typeIndex] as ItemType
    }
  }

}
