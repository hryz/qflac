export interface Tree<T> {
  node: T;
  childNodes: Array<Tree<T>>;
}

export function mapTree<T1, T2>(src: Tree<T1>, mapper: (t1: T1) => T2): Tree<T2> {
  return {
    node: mapper(src.node),
    childNodes: src.childNodes.map(c => mapTree(c, mapper))
  }
}

export function findTree<T>(src: Tree<T>, f: (tree: Tree<T>) => boolean): Tree<T> | undefined {
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

export function flatten<T>(src: Tree<T>) : T[] {
  const result: T[] = [];
  result.push(src.node);
  for (const c of src.childNodes){
     for(const x of flatten(c)){
       result.push(x);
     }
  }
  return result;
}