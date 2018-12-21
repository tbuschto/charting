import { View } from './View';
import { ImdbChart } from './ChartView';
import { AppStore } from './App';
import { ActionCreators } from './ActionCreators';
import { ImdbTableToChartDataConverter } from './ImdbTableToChartDataConverter';
import { ClearTableButton } from './Button';
import { DataSetSelectionList, XAxisModeList, YAxisModeList, ItemTypeList } from './List';
import { ImdbItemFilter } from './ImdbItemFilter';

export class MainView extends View<'div'> {

  constructor(
    store: AppStore,
    actions: ActionCreators,
    converter: ImdbTableToChartDataConverter,
    filter: ImdbItemFilter
  ) {
    super('div', {id: 'mainview'});
    this.append(
      new ImdbChart(store, actions, converter, filter),
      new View('div', {id: 'controls'}).append(
        new View('p').append('Ratings:'),
        new DataSetSelectionList(store, actions),
        new View('p').append('X-Axis:'),
        new XAxisModeList(store, actions),
        new View('p').append('Y-Axis:'),
        new YAxisModeList(store, actions),
        new View('p').append('Types:'),
        new ItemTypeList(store, actions),
        new ClearTableButton(store, actions)
      )
    )
  }

}
