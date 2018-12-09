enum Column {
  UserRating = 'Your Rating',
  Title = 'Title',
  Type = 'Title Type',
  Rating = 'IMDb Rating',
  Genre = 'Genres',
  Release ='Release Date'
}

export interface ImdbItem {
  userRating: number;
  title: string;
  genre: string[];
  release: Date;
  rating: number;
}

export type ImdbTable = ImdbItem[];

export class ImdbTableFactory {

  createTable(data: string): ImdbTable {
    const rows = data.trim().split('\n');
    const factory = new ImdbItemFactory(rows.shift());
    return rows.map(row => factory.createItem(row));
  }

}

class ImdbItemFactory {

  private _userRatingIndex: number;
  private _titleIndex: number;
  private _ratingIndex: number;
  private _genreIndex: number;
  private _releaseIndex: number;

  constructor(headerLine: string) {
    const columns = headerLine.split(',');
    this._userRatingIndex = columns.indexOf(Column.UserRating);
    this._titleIndex = columns.indexOf(Column.Title);
    this._ratingIndex = columns.indexOf(Column.Rating);
    this._genreIndex = columns.indexOf(Column.Genre);
    this._releaseIndex = columns.indexOf(Column.Release);
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
      title: data[this._titleIndex],
      genre: data[this._genreIndex].split(',').map(str => str.trim()),
      rating: parseFloat(data[this._ratingIndex]),
      userRating: parseFloat(data[this._userRatingIndex]),
      release: new Date(data[this._releaseIndex])
    }
  }

}
