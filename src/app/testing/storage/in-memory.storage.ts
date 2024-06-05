export class InMemoryStorage implements Storage {
  name: string = 'in-memory';

  private data: { [key: string]: string } = {};

  public get length(): number {
    return Object.keys(this.data).length;
  }

  public getItem(key: string): string | null {
    const json: string | null = this.data[key];

    return json ? JSON.parse(json) : null;
  }

  public setItem(key: string, value: string): void {
    this.data[key] = JSON.stringify(value);
  }

  public removeItem(key: string): void {
    if (this.data[key]) {
      delete this.data[key];
    }
  }

  public key(index: number): string | null {
    const keys: string[] = Object.keys(this.data);

    if (keys[index]) {
      return this.data[keys[index]];
    }

    return null;
  }

  public clear(): void {
    this.data = {};
  }
}
