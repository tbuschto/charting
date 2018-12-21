import { createStore, applyMiddleware } from 'redux';
import { App, AppStore, AppState } from './charts/App';
import { Reducer } from './charts/Reducer';
import { ImdbTableFilePicker } from './charts/FilePicker';
import { ImdbTableFactory } from './charts/ImdbTableFactory';
import { ActionCreators } from './charts/ActionCreators';
import { createLogger } from 'redux-logger';
import { MainView } from './charts/MainView';
import { Persistence } from './charts/Persistence';
import { ImdbTableToChartDataConverter } from './charts/ImdbTableToChartDataConverter';
import * as freeze from 'redux-freeze';
import reduxThunk from 'redux-thunk';

(async () => {

  console.info('Init REDUX Store...');

  const defaultState: AppState = {
    xAxis: 'Years',
    yAxis: 'Distribution',
    users: [],
    imdbTable: {}
  };

  const store: AppStore = createStore(
    new Reducer().chartsApp,
    Persistence.readState(defaultState),
    applyMiddleware(
      freeze as any, // broken type declaration of freeze
      reduxThunk,
      createLogger({})
    )
  ) as AppStore;

  new Persistence(store);

  const actions = new ActionCreators(
    new ImdbTableFactory()
  );

  console.info('App Start...');

  await new App(
    document.body,
    store,
    new ImdbTableFilePicker(store, actions),
    new MainView(
      store,
      actions,
      new ImdbTableToChartDataConverter()
    )
  ).start();

  console.info('DONE');

})();

