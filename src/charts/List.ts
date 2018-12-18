import { View } from './View';
import { AppStore } from './App';
import { ActionCreators } from './ActionCreators';
import { from } from 'rxjs';
import { distinctUntilKeyChanged } from 'rxjs/operators';

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