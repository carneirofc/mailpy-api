export function listFromObjects(objs: any) {
  /** Given an object where the key is the corresponding entry name, obtain a list */
  const items = [];
  for (let name in objs) {
    const obj = objs[name];
    items.push({ ...obj });
  }
  return items;
}
