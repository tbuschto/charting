import { View } from './View';
import { AppStore, XAxisMode, YAxisMode, Genres } from './App';
import { ActionCreators } from './ActionCreators';
import { from } from 'rxjs';
import { distinctUntilKeyChanged } from 'rxjs/operators';
import { ItemType } from './ImdbTableFactory';

type Item<T extends string = string> = {value: T, selected: boolean};

export class List<T extends string = string> extends View<'select'> {

  public onSelectionChanged = this.registerEvent<(items: Item[]) => any>();

  constructor(size: number, multiple: boolean) {
    super('select', {size, multiple}, {});
    this.element.addEventListener('change',
      () => this.emit(this.onSelectionChanged, this.items)
    );
  }

  public set items(items: Item<T>[]) {
    while (this.element.firstChild) {
      this.element.firstChild.remove();
    }
    items.forEach(item => {
      this.append(new View('option', item).append(item.value));
    });
  }

  public get items() {
    const items: Item<T>[] = [];
    this.element.childNodes.forEach(node => {
      if (node instanceof HTMLOptionElement) {
        items.push({value: node.value as T, selected: node.selected});
      }
    })
    return items;
  }

}

export class DataSetSelectionList extends List {
  constructor(store: AppStore, actions: ActionCreators) {
    super(3, true);
    from(store).pipe(distinctUntilKeyChanged('users')).subscribe(state => {
      this.items = state.users.map(user => ({value: user.name, selected: user.show}));
    });
    this.onSelectionChanged(items => {
      const selection: {[user: string]: boolean} = {};
      this.items.forEach(item => selection[item.value] = item.selected);
      store.dispatch(actions.showUserRatings(selection));
    });
  }
}

export class XAxisModeList extends List<XAxisMode> {
  constructor(store: AppStore, actions: ActionCreators) {
    super(3, false);
    from(store).pipe(distinctUntilKeyChanged('xAxis')).subscribe(({xAxis}) => {
      this.items = [
        {value: 'Years', selected: xAxis === 'Years'},
        {value: 'Decades', selected: xAxis === 'Decades'},
        {value: 'Rating', selected: xAxis === 'Rating'},
        {value: 'Genre', selected: xAxis === 'Genre'}
      ];
    });
    this.onSelectionChanged(items => {
      store.dispatch(actions.setXAxisMode(this.items.find(item => item.selected).value));
    });
  }
}

export class YAxisModeList extends List<YAxisMode> {
  constructor(store: AppStore, actions: ActionCreators) {
    super(4, false);
    from(store).pipe(distinctUntilKeyChanged('yAxis')).subscribe(({yAxis}) => {
      this.items = [
        {value: 'Distribution', selected: yAxis === 'Distribution'},
        {value: 'Average', selected: yAxis === 'Average'},
        {value: 'Median', selected: yAxis === 'Median'},
        {value: 'RT', selected: yAxis === 'RT'},
        {value: 'Count', selected: yAxis === 'Count'},
        {value: 'Percent', selected: yAxis === 'Percent'}
      ];
    });
    this.onSelectionChanged(items => {
      store.dispatch(actions.setYAxisMode(this.items.find(item => item.selected).value));
    });
  }
}

export class ItemTypeList extends List<ItemType> {
  constructor(store: AppStore, actions: ActionCreators) {
    super(4, true);
    from(store).pipe(distinctUntilKeyChanged('itemTypes')).subscribe(({itemTypes}) => {
      this.items = [
        {value: 'movie', selected: itemTypes.movie},
        {value: 'tvMovie', selected: itemTypes.tvMovie},
        {value: 'video', selected: itemTypes.video},
        {value: 'tvSeries', selected: itemTypes.tvSeries},
        {value: 'videoGame', selected: itemTypes.videoGame},
        {value: 'tvMiniSeries', selected: itemTypes.tvMiniSeries}
      ];
    });
    this.onSelectionChanged(items => {
      store.dispatch(actions.setItemTypes({
        movie: items[0].selected,
        tvMovie: items[1].selected,
        video: items[2].selected,
        tvSeries: items[3].selected,
        videoGame: items[4].selected,
        tvMiniSeries: items[5].selected
      }));
    });
  }
}

export class GenreList extends List<string> {
  constructor(store: AppStore, actions: ActionCreators) {
    super(4, true);
    from(store).pipe(distinctUntilKeyChanged('genres')).subscribe(({genres}) => {
      this.items = Object.keys(genres).sort().map(genre => {
        return {value: genre, selected: genres[genre]};
      });
    });
    this.onSelectionChanged(items => {
      const genres: Genres = {};
      items.forEach(item => {
        genres[item.value] = item.selected;
      })
      store.dispatch(actions.setGenres(genres));
    });
  }
}
