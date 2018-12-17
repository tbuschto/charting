import { View } from './View';
import { AppStore } from './App';
import { ActionCreators } from './ActionCreators';
import { from } from 'rxjs';

type Item = {value: string, selected: boolean};

export class List extends View<'select'> {

  public onSelectionChanged = this.registerEvent<(items: Item[]) => any>();

  constructor() {
    super('select', {size: 4, multiple: true}, {});
    this.element.addEventListener('change',
      () => this.emit(this.onSelectionChanged, this.items)
    );
  }

  public set items(items: Item[]) {
    while (this.element.firstChild) {
      this.element.firstChild.remove();
    }
    items.forEach(item => {
      this.append(new View('option', item).append(item.value));
    });
  }

  public get items() {
    const items: Item[] = [];
    this.element.childNodes.forEach(node => {
      if (node instanceof HTMLOptionElement) {
        items.push({value: node.value, selected: node.selected});
      }
    })
    return items;
  }

}

export class DataSetSelectionList extends List {
  constructor(store: AppStore, actions: ActionCreators) {
    super();
    from(store).subscribe(state => {
      this.items = [
        {value: 'IMDb', selected: state.showImdbRatings},
        {value: 'User', selected: state.showUserRatings}
      ];
    });
    this.onSelectionChanged(items => {
      store.dispatch(actions.showImdbRatings(items[0].selected));
      store.dispatch(actions.showUserRatings(items[1].selected));
    });
  }
}