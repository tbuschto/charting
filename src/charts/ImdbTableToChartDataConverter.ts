import { AppState, Color } from './App';
import { ImdbItem } from './ImdbTableFactory';
import { ChartDataSets } from 'chart.js';

export class ImdbTableToChartDataConverter {

  public convert(state: AppState): Chart.ChartDataSets[] {
    const table = state.imdbTable;
    if (!Object.keys(table).length) {
      return [];
    }
    const items = Object.keys(table).map(id => table[id]);
    const result: Chart.ChartDataSets[] = [];
    state.users.forEach((user, i) => {
      if (user.show) {
        result.push(this.getRatings(items, user.name, user.color));
      }
    })
    return result;
  }

  private getRatings(
    items: ImdbItem[],
    ratingName: string,
    color: Color
  ): Chart.ChartDataSets {
    const years = this.groupByYear(items);
    const data: Chart.ChartPoint[] = [];
    for (let year in years) {
      const ratings = this.groupByRating(years[year], ratingName);
      for(let rating in ratings) {
        let labels =
        data.push({
          label: this.getLabel(year, rating, ratings[rating]),
          x: parseInt(year),
          y: parseInt(rating),
          r: ratings[rating].length + 3
        } as Chart.ChartPoint);
      }
    }
    return {
      label: ratingName,
      backgroundColor: `rgb(${color.join(', ')}, 0.5)`,
      borderColor: `rgb(${color.join(', ')})`,
      hoverRadius: 0,
      hoverBorderColor: 'white',
      data
    } as ChartDataSets; // casting needed due to broken type declarations
  }

  private getLabel(year: string, rating: string, items: ImdbItem[]): string {
    const titles: string[] = items.map(item => item.title);
    const max = 4;
    const result: Array<string|number> = [rating, ' (', year, '): '];
    if (titles.length <= max) {
      result.push(titles.join(', '));
    } else {
      result.push(titles.slice(0, max).join(', '));
      result.push(' and ', titles.length - max, ' more...');
    }
    return result.join('');
  }

  private groupByYear(items: ImdbItem[]): {[key: string]: ImdbItem[]} {
    const years: {[key: string]: ImdbItem[]} = {};
    items.forEach(item => {
      const year = yearOf(item.release);
      if (!years[year]) {
        years[year] = [];
      }
      years[year].push(item);
    });
    return years;
  }

  private groupByRating(items: ImdbItem[], ratingName: string): {[key: string]: ImdbItem[]} {
    const ratings: {[key: string]: ImdbItem[]} = {};
    items.forEach(item => {
      const rating = Math.round(item.ratings[ratingName]);
      if (!ratings[rating]) {
        ratings[rating] = [];
      }
      ratings[rating].push(item);
    });
    return ratings;
  }

}

function yearOf(date: string): number {
  return new Date(date).getFullYear()
}
