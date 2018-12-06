/// <reference path="../../node_modules/@types/chart.js/index.d.ts" />

namespace Charts {

  export class App {

    constructor(
      private _imdbTableFactory: IMDBTableFactory
    ) {}

    public async start() {
      const picker = this.createFilePicker()
      const files = await this.getFiles(picker);
      const table = this._imdbTableFactory.createTable(await this.blobToString(files[0]));
      picker.remove();
      this.createChart(table);
    }

    async getFiles(picker: HTMLInputElement): Promise<FileList> {
      return new Promise<FileList>(resolve => {
        picker.addEventListener('change', () => resolve(picker.files));
      });
    }

    async blobToString(blob: Blob): Promise<string> {
      return new Promise<string>(resolve => {
        const reader = new FileReader();
        reader.readAsText(blob);
        reader.addEventListener('loadend', () => resolve(reader.result as string));
      });
    }

    createFilePicker(): HTMLInputElement {
      const input = document.createElement('input')
      input.type = 'file';
      document.body.append(input);
      return input;
    }

    createChart(table: IMDBItem[]): Chart {
      const chartContainer = document.createElement('div');
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;
      Object.assign(chartContainer.style, {width: '800px', height: '1200px'});
      chartContainer.append(canvas);
      document.body.append(chartContainer);
      const type: Chart.ChartType = 'scatter';
      return new Chart(ctx, {
        type,
        options: {
          title: {display: true, text: `${table.length} Titles`},
        },
        data: {
          datasets: [
            {
              data: table.map<Chart.ChartPoint>(item => ({
                x: item.release.getFullYear(),
                y: item.userRating
              }))
            }
          ]
        }
      });
    }
  }

}
