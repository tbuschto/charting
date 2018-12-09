import {createStore} from 'redux';
import {App, AppStore} from './charts/App';
import {Reducer} from './charts/Reducer';
import {ActionCreators} from './charts/ActionCreators';
import {FileService} from './charts/FileService';
import {ImdbTableFactory} from './charts/ImdbTableFactory';

console.log('App start');

const store: AppStore = createStore(new Reducer().chartsApp, {
  imdbTable: null,
  showUserRatings: true,
  showImdbRatings: false
});

new App(
  store,
  new ImdbTableFactory(),
  new FileService(),
  new ActionCreators()
).start();
