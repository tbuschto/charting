import { View } from './View';
import { ActionCreators } from './ActionCreators';
import { from } from 'rxjs';
import { AppStore } from './App';
import { distinctUntilKeyChanged } from 'rxjs/operators';

export class CheckBox extends View<'span'> {

  public onCheckedChanged = this.registerEvent<(checked: boolean) => any>();

  private _input: View<'input'>;
  private _label: View<'a'>;

  constructor(label: string, radio: boolean) {
    super('span', {}, {cursor: 'pointer', userSelect: 'none', paddingRight: '10px'});
    this._input = new View('input', {type: radio ? 'radio' : 'checkbox'});
    this._label = new View('a').append(label);
    this.append(this._input, this._label);
    this._label.onClick(() => {
      this.checked = !this.checked;
      this.emit(this.onCheckedChanged, this.checked);
    });
    this._input.element.addEventListener('change',
      () => this.emit(this.onCheckedChanged, this.checked)
    );
  }

  public set checked(value: boolean) {
    this._input.element.checked = value;
  }

  public get checked() {
    return this._input.element.checked;
  }

}

export class SelectOrRadioButton extends CheckBox {
  constructor(store: AppStore, actions: ActionCreators) {
    super('OR', true);
    from(store).pipe(distinctUntilKeyChanged('userLogic')).subscribe(({userLogic}) => {
      this.checked = userLogic === 'OR';
    });
    this.onCheckedChanged(checked => {
      if (checked) { store.dispatch(actions.setUserLogic('OR')); }
    });
  }
}

export class SelectAndRadioButton extends CheckBox {
  constructor(store: AppStore, actions: ActionCreators) {
    super('AND', true);
    from(store).pipe(distinctUntilKeyChanged('userLogic')).subscribe(({userLogic}) => {
      this.checked = userLogic === 'AND';
    });
    this.onCheckedChanged(checked => {
      if (checked) { store.dispatch(actions.setUserLogic('AND')); }
    });
  }
}

export class SelectXorRadioButton extends CheckBox {
  constructor(store: AppStore, actions: ActionCreators) {
    super('XOR', true);
    from(store).pipe(distinctUntilKeyChanged('userLogic')).subscribe(({userLogic}) => {
      this.checked = userLogic === 'XOR';
    });
    this.onCheckedChanged(checked => {
      if (checked) { store.dispatch(actions.setUserLogic('XOR')); }
    });
  }
}