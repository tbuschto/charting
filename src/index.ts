import { createStore, applyMiddleware } from 'redux';
import { App, AppStore } from './charts/App';
import { Reducer } from './charts/Reducer';
import { ImdbTableFilePicker } from './charts/FilePicker';
import { ImdbTableFactory } from './charts/ImdbTableFactory';
import { ActionCreators } from './charts/ActionCreators';
import { createLogger } from 'redux-logger';
import { MainView } from './charts/MainView';
import { ImdbTableToChartDataConverter } from './charts/ImdbTableToChartDataConverter';

(async () => {

  console.info('Init REDUX Store...');

  const store: AppStore = createStore(
    new Reducer().chartsApp,
    {
      imdbTable: [],
      showUserRatings: true,
      showImdbRatings: false
    },
    applyMiddleware(createLogger({}))
  );

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

