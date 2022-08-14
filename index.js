const { from } = rxjs;
const { tap, filter, max, elementAt, distinct, reduce } = rxjs.operators;

from([9, 3, 10, 5, 1, 10, 9, 9, 1, 4, 1, 8, 6, 2, 7, 2, 5, 5, 10, 2])
  .pipe(
    distinct(),
    filter((x) => x % 2 !== 0),
    reduce((acc, cur) => {
      return acc + cur;
    }, 0)
  )
  .subscribe((x) => console.log("발행물: " + x));
