import 'paper-range-slider';

import {View} from './View';
import { AppStore } from './App';
import { ActionCreators } from './ActionCreators';
import { from } from 'rxjs';
import { distinctUntilKeyChanged } from 'rxjs/operators';
import { YEAR_MIN, YEAR_MAX } from './ImdbTableToChartDataConverter';

export class Slider extends View<'div'> {

  public onRangeChanged = this.registerEvent<(range: [number, number]) => any>();

  constructor() {
    super('paper-range-slider' as any, {id: 'test'});
    this.getHiddenParent().append(this.element);
    this.element.addEventListener('updateValues',
      () => this.emit(this.onRangeChanged, this.range)
    );
    this.onRangeChanged(r => console.log(r));
  }

  set range(value: [number, number]) {
    (this.element as any).setValues(
      Math.max(this.min, value[0]),
      Math.min(this.max, value[1])
    );
  }

  get range() {
    return [
      (this.element as any).valueMin,
      (this.element as any).valueMax
    ];
  }

  set max(value: number) {
    (this.element as any).setMax(value);
  }

  get max() {
    return (this.element as any).max;
  }

  set min(value: number) {
    (this.element as any).setMin(value);
  }

  get min() {
    return (this.element as any).min;
  }

  set diffMin(value: number) {
    (this.element as any).setValueDiffMin(value);
  }

  get diffMin() {
    return (this.element as any).diffMin;
  }

  private getHiddenParent(): HTMLDivElement {
    let result = document.getElementById('hidden');
    if (!result) {
      result = document.createElement('div');
      result.style.display = 'none';
      result.id = 'hidden';
      document.body.appendChild(result);
    }
    return result as HTMLDivElement;
  }

}

export class YearsSlider extends Slider {
  constructor(store: AppStore, actions: ActionCreators) {
    super();
    this.diffMin = 1;
    this.min = YEAR_MIN;
    this.max = YEAR_MAX;
    from(store).pipe(distinctUntilKeyChanged('years')).subscribe(({years}) => {
      this.range = years;
    });
    this.onRangeChanged(range => {
      store.dispatch(actions.setYears(range));
    })
  }
}

export class RatingsSlider extends Slider {
  constructor(store: AppStore, actions: ActionCreators) {
    super();
    this.diffMin = 0;
    this.min = 1;
    this.max = 10;
    from(store).pipe(distinctUntilKeyChanged('ratings')).subscribe(({ratings}) => {
      this.range = ratings;
    });
    this.onRangeChanged(range => {
      store.dispatch(actions.setRatings(range));
    })
  }
}