declare global {

  interface Array<T> {
    any(predicate: (elem: T) => boolean): boolean;
    all(predicate: (elem: T) => boolean): boolean;
    groupBy<TKey>(mapper: (elem: T) => TKey) : Array<Grouping<TKey, T>>;
  }

  interface Grouping<TKey, TValue> {
    key : TKey;
    values: TValue[];
  }
}

Array.prototype.any =
  Array.prototype.any ||
  function<T>(this: T[], predicate: (elem: T) => boolean) {
    return this.reduce((prev, cur) => prev || predicate(cur), false);
  };

Array.prototype.all =
  Array.prototype.all ||
  function<T>(this: T[], predicate: (elem: T) => boolean) {
    return this.reduce((prev, cur) => prev && predicate(cur), true);
  };

Array.prototype.groupBy =
  Array.prototype.groupBy ||
  function<T, TKey>(this: T[], mapper: (elem: T) => TKey): Array<Grouping<TKey, T>> {
    const result: Array<Grouping<TKey, T>> = [];
    function addOrCreate(key: TKey, value: T) {
      const item = result.find(x => x.key === key);
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
