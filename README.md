# rxjs

https://www.yalco.kr/@rxjs/1-1/
rxjs를 공부해보자!

# 0730

## Observe 할 대상(=== Observable)을 생성하는 방법

1. 배열 스트림
   배열을 만드는 방식이 다양한듯!

```js
const { of, from, range, generate } = rxjs;

const obs1$ = of(1, 2, 3, 4, 5);
const obs2$ = from([6, 7, 8, 9, 10]);
const obs3$ = range(11, 5);
const obs4$ = generate(
  15,
  (x) => x < 30,
  (x) => x + 2
);
```

2. 시간에 의한 스트림
   이것도 편리해보임

```js
const { interval, timer, timeout } = rxjs;

const obs1$ = interval(1000);
// timer(initialDelay: number | Date, period: number, scheduler: Shceduler)
const obs2$ = timer(3000);
const obs3$ = timeout(3000);
```

3. 이벤트에 의한 스트림

   이것도 쌈박하네~

```js
const { fromEvent } = rxjs;

const obs1$ = fromEvent(document, "click");
const obs2$ = fromEvent(document.getElementById("myInput"), "keypress");
```

4. ajax를 통한 스트림

   이것도 신기해!!

```js
const { ajax } = rxjs.ajax;

const obs$ = ajax(`http://127.0.0.1:3000/people/1`);
obs$.subscribe((result) => console.log(result.response));
```

### Observable의 특성

위처럼 정의한 스트림에 pipe를 달아서 원하는 처리를 하면된다.

1. 누군가 구독을 해야 발행을 시작함
   subscribe하지않는다면 아무일도 일어나지않음
2. 각 구독자에게 따로따로 발행된다.
   observable의 원본은 그대로 유지가됨

---

## Pipable operators

- `Observable`의 데이터를 pure function으로 가공 : 현존하는 데이터를 수정하지 않는다.
- `rxjs.operators`에서 로드함
- `pipe`함수에 하나 이상 넣어서 연결하면된다.
- 파이프에는 하나 이상의 operator들이 쉼표로 구분되어 들어감.

- operators 안에있는 tap함수는 원하는 동작을 미리 실행시켜볼수있음

```js
const { interval } = rxjs;

const { tap, filter, map } = rxjs.operators;
const observable$ = interval(1000);

// ... observer 정의

observable$
  .pipe(
    tap(console.log),
    filter((x) => x % 2 === 0),
    map((x) => x * x)
  )
  .subscribe(observer);
```

## Subject

```js
const { Subject } = rxjs;
const subject = new Subject();

subject.subscribe(console.log);

subject.next(1);
subject.next(3);
subject.next(5);
```

### Observable과의 차이

> Observable === 넷플릭스
>
> - 누군가 구독을 해야 발행을 시작
> - 각 구독자에게 따로 발행
> - unicast : observer에게 맞춤형 서비스를 발행하는것

> Subject === TV 채널
>
> - 개발자가 원하는 시점에 발행
> - 모든 구독자에게 똑같이 발행
> - multicast
