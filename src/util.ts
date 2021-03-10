export function populate<T>(t: T, p?: Partial<T>): void {
  if (p == null) {
    return;
  }

  for (const k in p) {
    if (p[k] == null) {
      delete p[k];
    }
  }
  Object.assign(t, p);
}

export function roundN(n: number, prec = 0, amp = 1): number {
  if (n === Infinity || n === -Infinity || isNaN(n)) {
    return n;
  }

  let m = 1.0;
  if (n < 0) {
    m = -m;
    n = -n;
  }

  const a = n.toString().split('e');
  const b = Math.round(+(a[0] + 'e' + (a[1] ? +a[1] + prec : prec)) / amp) * amp;
  const c = b.toString().split('e');
  const d = +(c[0] + 'e' + (c[1] ? +c[1] - prec : -prec));
  return m * d;
}
