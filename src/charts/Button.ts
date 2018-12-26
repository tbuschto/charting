import {View} from "./View";
import { AppStore } from './App';
import { ActionCreators } from './ActionCreators';
import { ImdbItemFilter } from './ImdbItemFilter';

export default class Button extends View<'button'> {

  constructor(text: string) {
    super('button', {innerText: text});
  }

  public set enabled(value: boolean) {
    this.element.disabled = !value;
  }

}

export class ClearTableButton extends Button {
  constructor(store: AppStore, actions: ActionCreators) {
    super('Clear');
    this.onClick(() => store.dispatch(actions.clearTableData()));
  }
}

export class ShowDataButton extends Button {
  constructor(store: AppStore, actions: ActionCreators) {
    super('Show Data');
    this.onClick(() => store.dispatch(actions.showTableView()));
  }
}
