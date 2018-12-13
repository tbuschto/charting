import {View} from "./View";
import { AppStore } from './App';
import { ActionCreators } from './ActionCreators';

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
