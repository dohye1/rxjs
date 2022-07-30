const { interval } = rxjs;

const obs$ = interval(1000);

obs$.subscribe((x) => console.log("바로구독: " + x));
setTimeout((_) => {
  obs$.subscribe((x) => console.log("3초 후 구독: " + x));
}, 3000);
setTimeout((_) => {
  obs$.subscribe((x) => console.log("5초 후 구독: " + x));
}, 5000);
setTimeout((_) => {
  obs$.subscribe((x) => console.log("10초 후 구독: " + x));
}, 10000);
