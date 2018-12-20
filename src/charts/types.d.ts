import {Action, AnyAction} from 'redux';
import { Observable } from 'rxjs';
import 'chart.js';

// Fixes

declare module 'redux' {
  interface Store<S = any, A extends Action = AnyAction> {
    [Symbol.observable]: () =>  Observable<S>
  }
}

declare module 'chart.js' {
  interface ChartDataSets {
    hoverRadius: number;
  }
  export class Scale {
    public chart: Chart;
  }
}

// Extensions

declare module 'chart.js' {
  interface ChartPoint {
    label: string;
  }
}
