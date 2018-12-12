import { AppState } from './App';
import { ImdbTable, ImdbItem } from './ImdbTableFactory';

export class ImdbTableToChartDataConverter {

  public convert(state: AppState): Chart.ChartDataSets[] {
    const table = state.imdbTable;
    if (!state.showImdbRatings && !state.showUserRatings) {
      const years = this.groupByYear(table);
      return [{
        data: Object.keys(years).sort().map<Chart.ChartPoint>(year => ({
          x: parseInt(year, 10),
          y: years[year].length
        }))
      }];
    }
    const result: Chart.ChartDataSets[] = [];
    if (state.showImdbRatings) {
      result.push({data: table.map<Chart.ChartPoint>(item => ({
        x: item.release.getFullYear(),
        y: item.rating
      }))});
    }
    if (state.showUserRatings) {
      result.push({data: table.map<Chart.ChartPoint>(item => ({
        x: item.release.getFullYear(),
        y: item.userRating
      }))});
    }
    return result;
  }

  private groupByYear(imdbTable: ImdbTable): {[key: string]: ImdbItem[]} {
    const years: {[key: string]: ImdbItem[]} = {};
    imdbTable.forEach(item => {
      const year = item.release.getFullYear();
      if (!years[year]) {
        years[year] = [];
      }
      years[year].push(item);
    });
    return years;
  }

}