export function assertIsDefine<T>(val: T): asserts val is NonNullable<T> {
  if (!val) {
    throw Error('expected "val" to be define but recieved ' + val);
  }
}
