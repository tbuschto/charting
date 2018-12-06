namespace App {

  export class IMDBTable {

    private _items: IMDBItem[];

    constructor(data: string) {
      const rows = data.trim().split('\n');
      const factory = new App.IMDBItemFactory(rows.shift());
      this._items = rows.map(row => factory.createItem(row));
    }

    public get length(): number {
      return this._items.length;
    }

    public map<T>(cb: (item: IMDBItem) => T) {
      return this._items.map(cb);
    }

  }

}
