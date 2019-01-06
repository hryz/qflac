declare global {
  interface Promise<T> {
    cast<TResult>(): Promise<TResult>;
  }
  interface Array<T> {
    firstOrDefault(predicate: (elem: T) => boolean): T | null;
    any(predicate: (elem: T) => boolean): boolean;
    all(predicate: (elem: T) => boolean): boolean;
    contains(elem: T): boolean;
    orderBy<TElem>(mapper: (elem: T) => TElem): T[];
    orderByDesc<TElem>(mapper: (elem: T) => TElem): T[];
    groupBy<TElem>(mapper: (elem: T) => TElem): Map<TElem, T[]>;
  }
}

// Promise extensions
Promise.prototype.cast =
  Promise.prototype.cast ||
  async function<T>(this: Promise<any>) {
    const result = await this;
    return result as T;
  };

// Basic LINQ
Array.prototype.firstOrDefault =
  Array.prototype.firstOrDefault ||
  function<T>(this: T[], predicate: (elem: T) => boolean) {
    for (const i of this) {
      if (predicate(i)) {
        return i;
      }
    }
    return undefined;
  };

Array.prototype.any =
  Array.prototype.any ||
  function<T>(this: T[], predicate: (elem: T) => boolean) {
    return this.reduce((prev, cur) => prev || predicate(cur), false);
  };

Array.prototype.contains =
  Array.prototype.contains ||
  function<T>(this: T[], elem: T) {
    return this.includes(elem);
  };

Array.prototype.all =
  Array.prototype.all ||
  function<T>(this: T[], predicate: (elem: T) => boolean) {
    return this.reduce((prev, cur) => prev && predicate(cur), true);
  };

Array.prototype.orderBy =
  Array.prototype.orderBy ||
  function<T, TElem>(this: T[], mapper: (elem: T) => TElem) {
    function comparer(a: TElem, b: TElem) {
      return a > b ? 1 : a < b ? -1 : 0;
    }

    return this.sort((a, b) => comparer(mapper(a), mapper(b)));
  };

Array.prototype.orderByDesc =
  Array.prototype.orderByDesc ||
  function<T, TElem>(this: T[], mapper: (elem: T) => TElem) {
    function comparer(a: TElem, b: TElem) {
      return a < b ? 1 : a > b ? -1 : 0;
    }

    return this.sort((a, b) => comparer(mapper(a), mapper(b)));
  };

Array.prototype.groupBy =
  Array.prototype.groupBy ||
  function<T, TElem>(this: T[], mapper: (elem: T) => TElem) {
    const result: Map<TElem, T[]> = new Map();
    function addOrCreate(key: TElem, value: T) {
      const item = result.get(key);
      if (item) {
        item.push(value);
      } else {
        result.set(key, [value]);
      }
    }
    this.forEach(i => addOrCreate(mapper(i), i));
    return result;
  };

export {};
