import { all } from 'deepmerge';

export function merge(...objs) {
  return all(objs);
}
