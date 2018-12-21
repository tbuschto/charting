import { AppState, XAxisMode, User, YAxisMode } from './App';
import { ImdbItem } from './ImdbTableFactory';
import { ChartDataSets } from 'chart.js';

type Category = {name: string, items: ImdbItem[]};
type Categories = Category[];

export const YEAR_MIN = 1920;
export const YEAR_MAX = 2020;

export class ImdbTableToChartDataConverter {

  public convert(state: AppState): Chart.ChartData {
    const table = state.imdbTable;
    const result: Chart.ChartData = {datasets: [], labels: []};
    const items = Object.keys(table).map(id => table[id]);
    if (items.length) {
      state.users.forEach(user => {
        if (user.show) {
          const categories = this.groupByCategory(state.xAxis, items);
          result.datasets.push(this.getDataSet(categories, user, state));
          result.labels = categories.map(cat => cat.name);
        }
      })
    }
    return result;
  }

  private getDataSet(categories: Categories, user: User, state: AppState): Chart.ChartDataSets {
    if (state.yAxis === 'Distribution') {
      return this.getAllRatings(categories, user, state);
    }
    return this.getAccumulatedRatings(categories, user, state);
  }

  private getAllRatings(categories: Categories, user: User, state: AppState): Chart.ChartDataSets {
    const data: Chart.ChartPoint[] = [];
    const xAxis = state.xAxis;
    categories.forEach((cat, i) => {
      const ratings = this.groupByRating(cat.items, user.name);
      for(let rating in ratings) {
        data.push({
          label: this.getLabel(cat.name, ratings[rating]),
          x: i,
          y: parseInt(rating),
          r: Math.round(ratings[rating].length / (xAxis === 'Decades' ? 8 : 2)) + 3
        });
      }
    });
    return {
      label: user.name,
      backgroundColor: `rgb(${user.color.join(', ')}, 0.5)`,
      borderColor: `rgb(${user.color.join(', ')})`,
      hoverRadius: 0,
      hoverBorderColor: 'white',
      data
    };
  }

  private getAccumulatedRatings(categories: Categories, user: User, state: AppState): Chart.ChartDataSets {
    const fallback = state.xAxis === 'Decades' ? 0 : undefined;
    const data: number[] = categories.map(cat =>
      roundTo(this.acc(itemsToRatings(cat.items, user), state.yAxis, fallback), 2)
    );
    const rgb = `rgb(${user.color.join(', ')})`;
    return {
      label: user.name,
      backgroundColor: state.xAxis === 'Years' ? 'transparent' : rgb,
      borderColor: rgb,
      hoverRadius: 0,
      hoverBorderColor: 'white',
      lineTension: 0.33,
      data
    };
  }

  private acc(ratings: number[], mode: YAxisMode, fallback: any): number {
    if (!ratings.length) {
      return fallback;
    }
    if (mode === 'Average') {
      return ratings.reduce((prev, curr) => prev + (curr || 0)) / ratings.length
    }
    if (mode === 'Median') {
      console.log(ratings);
      return ratings.sort()[Math.floor(ratings.length / 2)];
    }
    if (mode === 'RT') {
      return (10 / ratings.length) * ratings.filter(i => i >= 7).length;
    }
    throw new Error('acc does not support mode ' + mode);
  }

  private getLabel(category: string, items: ImdbItem[]): string {
    const titles: string[] = items.map(item => item.title);
    const max = 3;
    const result: Array<string|number> = [category, ': '];
    if (titles.length <= max) {
      result.push(titles.join(', '));
    } else {
      result.push(titles.slice(0, max).join(', '));
      result.push(' and ', titles.length - max, ' more...');
    }
    return result.join('');
  }

  private groupByCategory(xAxis: XAxisMode, items: ImdbItem[]): Categories {
    if (xAxis === 'Decades') {
      return this.groupByDecade(items);
    }
    return this.groupByYear(items);
  }

  private groupByYear(items: ImdbItem[]): Categories {
    const unsort: {[year: number]: ImdbItem[]} = {};
    items.forEach(item => {
      const year = yearOf(item.release);
      if (isNaN(year)) {
        console.warn(`No release year for ${item.title}`);
        return;
      }
      const items = unsort[year] = unsort[year] || []
      items.push(item);
    });
    const result: Categories = [];
    for (let i = YEAR_MIN; i <= YEAR_MAX; i++) {
      result[i - YEAR_MIN] = {name: i + '', items: unsort[i] || []};
    }
    return result;
  }

  private groupByDecade(items: ImdbItem[]): Categories {
    const unsort: {[decade: number]: ImdbItem[]} = {};
    items.forEach(item => {
      const decade = decadeOf(item.release);
      if (isNaN(decade)) {
        console.warn(`No release decade for ${item.title}`);
        return;
      }
      const items = unsort[decade] = unsort[decade] || []
      items.push(item);
    });
    const result: Categories = [];
    for (let i = YEAR_MIN; i <= YEAR_MAX; i += 10) {
      result.push({name: i + 's', items: unsort[i] || []});
    }
    return result;
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

function decadeOf(date: string): number {
  return Math.floor(yearOf(date) / 10) * 10;
}

function yearOf(date: string): number {
  return new Date(date).getFullYear()
}

function roundTo(value: number, points: number) {
  if (typeof value !== 'number') {
    return undefined;
  }
  const factor = 10^points;
  return Math.round(value * factor) / factor;
}

function itemsToRatings(items: ImdbItem[], user: User): number[] {
  return items.filter(item => user.name in item.ratings).map(item => item.ratings[user.name]);
}
