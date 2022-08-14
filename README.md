# rxjs

[rxjs를 공부해보자!](https://www.yalco.kr/@rxjs/1-1/)

# 스트림

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

### 사용 예시

- observable과 subject를 조합해서 사용할 수 있다.
- 아래 코드에서 subject는 하나의 값이다.
- 다른 시기에 구독을 시작한 observer들이 같은 값을 발행받도록 할때 Subject를 사용할 수 있다.

```js
const subject = new Subject();
const obs$ = interval(1000);

obs$.subscribe((x) => subject.next(x));

subject.subscribe((x) => console.log("바로구독: " + x));
setTimeout((_) => {
  subject.subscribe((x) => console.log("3초 후 구독: " + x));
}, 3000);
setTimeout((_) => {
  subject.subscribe((x) => console.log("5초 후 구독: " + x));
}, 5000);
setTimeout((_) => {
  subject.subscribe((x) => console.log("10초 후 구독: " + x));
}, 10000);
```

### 여러 Subject

> BehaviorSubject

- 초기값 설정 가능함
  `new BehaviorSubject(0)`
- 마지막 값을 저장 후 추가 구독자에게 발행함

> ReplaySubject

- 마지막 N개 값을 저장 후 추가 구독자에게 발행

```js
const { ReplaySubject } = rxjs;
const subject = new ReplaySubject(3); // 마지막 3개 값 저장

subject.subscribe((x) => console.log("A: " + x));

subject.next(1);
subject.next(2);
subject.next(3);
subject.next(4);
subject.next(5);

subject.subscribe((x) => console.log("B: " + x));

subject.next(6);
subject.next(7);
```

> AsyncSubject

- complete후의 마지막 값만 발행
- 구독이 언제 시작됐든, 마지막값만 발행한다.
- `subject.complete()`를 호출할때만 구독된것들이 실행됨

# Operator
