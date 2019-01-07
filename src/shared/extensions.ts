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
    groupBy<TKey>(mapper: (elem: T) => TKey) : Array<Grouping<TKey, T>>;
  }

  interface Grouping<TKey, TValue> {
    key : TKey;
    values: TValue[];
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
    return null;
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
  function<T, TKey>(this: T[], mapper: (elem: T) => TKey): Array<Grouping<TKey, T>> {
    const result: Array<Grouping<TKey, T>> = [];
    function addOrCreate(key: TKey, value: T) {
      const item = result.firstOrDefault(x => x.key === key);
      if (item) {
        item.values.push(value);
      } else {
        result.push({key, values: [value]});
      }
    }
    this.forEach(i => addOrCreate(mapper(i), i));
    return result;
  };

export {};
