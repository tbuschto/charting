export class FileService {

  public async getTextFiles() {
    const picker = this.createFilePicker()
    const files = await this.getFiles(picker);
    picker.remove();
    return this.blobToString(files[0]);
  }

  private async getFiles(picker: HTMLInputElement): Promise<FileList> {
    return new Promise<FileList>(resolve => {
      picker.addEventListener('change', () => resolve(picker.files));
    });
  }

  private async blobToString(blob: Blob): Promise<string> {
    return new Promise<string>(resolve => {
      const reader = new FileReader();
      reader.readAsText(blob);
      reader.addEventListener('loadend', () => resolve(reader.result as string));
    });
  }

  private createFilePicker(): HTMLInputElement {
    const input = document.createElement('input')
    input.type = 'file';
    document.body.append(input);
    return input;
  }

}
