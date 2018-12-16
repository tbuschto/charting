import { AppState } from './App';
import { ImdbTable, ImdbItem } from './ImdbTableFactory';

const COLOR_IMDB = 'rgb(245, 197, 24)';
const COLOR_USER = 'rgb(66, 104, 241)';
const COLOR_GENERIC = 'rgb(2, 172, 211)';

export class ImdbTableToChartDataConverter {

  public convert(state: AppState): Chart.ChartDataSets[] {
    const table = state.imdbTable;
    if (!table.length) {
      return [];
    }
    const result: Chart.ChartDataSets[] = [];
    if (!state.showImdbRatings && !state.showUserRatings) {
      result.push(this.getStatisticalData(table));
    }
    if (state.showUserRatings) {
      result.push(this.getUserRatingData(table));
    }
    if (state.showImdbRatings) {
      result.push(this.getImdbRatingData(table));
    }
    return result;
  }

  private getStatisticalData(table: ImdbTable) {
    const years = this.groupByYear(table);
    return {
      backgroundColor: COLOR_GENERIC,
      borderColor: COLOR_GENERIC,
      pointHoverBorderColor: 'white',
      pointRadius: 4,
      data: Object.keys(years).sort().map<Chart.ChartPoint>(year => ({
        x: parseInt(year, 10),
        y: years[year].length
      }))
    }
  }

  private getImdbRatingData(table: ImdbTable) {
    return {
      backgroundColor: COLOR_IMDB,
      borderColor: COLOR_IMDB,
      pointHoverBorderColor: 'white',
      pointRadius: 4,
      data: table.map<Chart.ChartPoint>(item => ({
      label: `${item.title}: ${item.rating}`,
      x: yearOf(item.release),
      y: item.rating
    }))};
  }

  private getUserRatingData(table: ImdbTable) {
    return {
      backgroundColor: COLOR_USER,
      borderColor: COLOR_USER,
      pointHoverBorderColor: 'white',
      pointRadius: 4,
      data: table.map<Chart.ChartPoint>(item => ({
      label: `${item.title}: ${item.userRating}`,
      x: yearOf(item.release),
      y: Math.min(item.userRating, 9.99)
    }))};
  }

  private groupByYear(imdbTable: ImdbTable): {[key: string]: ImdbItem[]} {
    const years: {[key: string]: ImdbItem[]} = {};
    imdbTable.forEach(item => {
      const year = yearOf(item.release);
      if (!years[year]) {
        years[year] = [];
      }
      years[year].push(item);
    });
    return years;
  }

}

function yearOf(date: string): number {
  return new Date(date).getFullYear()
}
