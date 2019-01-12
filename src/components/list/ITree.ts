export interface ITree<T> {
  node: T;
  childNodes: Array<ITree<T>>;
}

export function mapTree<T1, T2>(src: ITree<T1>, mapper: (t1: T1) => T2): ITree<T2> {
  return {
    node: mapper(src.node),
    childNodes: src.childNodes.map(c => mapTree(c, mapper))
  }
}

export function findTree<T>(src: ITree<T>, f: (tree: ITree<T>) => boolean): ITree<T> | undefined {
  if (f(src) === true) {
    return src;
  } else {
    for(const c of src.childNodes){
      const result = findTree(c, f);
      if(result !== undefined){
        return result;
      }
    }
    return undefined;
  }
}