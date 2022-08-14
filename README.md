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

## 산수관련 연산자

- count, max, min, reduce

```js
obs$.pipe(count()).subscribe((x) => console.log("count: " + x));
```

## 선택관련 연산자

- first, last, elementAt, distinct, filter
- distinct는 중복된 값을 제거하고 유일한 값만 반환해준다.

## Tap operator

- 통과되는 모든 값마다 특정 작업을 수행
- 발행 결과에 영향을 주지 않음

```js
const { from } = rxjs;
const { tap, filter, distinct } = rxjs.operators;

from([9, 3, 10, 5, 1, 10, 9, 9, 1, 4, 1, 8, 6, 2, 7, 2, 5, 5, 10, 2])
  .pipe(
    tap((x) => console.log("-------------- 처음 탭: " + x)),
    filter((x) => x % 2 === 0),
    tap((x) => console.log("--------- 필터 후: " + x)),
    distinct(),
    tap((x) => console.log("중복 제거 후: " + x))
  )
  .subscribe((x) => console.log("발행물: " + x));
```

## transformation 연산자들

### map

### pluck

- 특정 객체의 특정 항목만 뽑아낼때 사용하기 편리함
- 여러 depth의 값을 쉽게 뽑아낼수있어서 ajax 요청에도 유용하게 사용됨

```js
const { from } = rxjs;
const { pluck } = rxjs.operators;

const obs$ = from([
  { name: "apple", price: 1200, info: { category: "fruit" } },
  { name: "carrot", price: 800, info: { category: "vegetable" } },
  { name: "pork", price: 5000, info: { category: "meet" } },
  { name: "milk", price: 2400, info: { category: "drink" } },
]);

obs$.pipe(pluck("price")).subscribe(console.log);
```

- 아래처럼 배열의 index로도 접근 가능하다.

```js
pluck("response", "items", 0, "html_url");
```

### toArray

- 연속되는 일련의 값들을 한 배열로 묶어서 보낸다
- 아래 코드에 toArray로 처리해주지않으면 그냥 개별값으로 출력이됨

```js
const { range } = rxjs;
const { toArray, filter } = rxjs.operators;

range(1, 50)
  .pipe(
    filter((x) => x % 3 === 0),
    filter((x) => x % 2 === 1),
    toArray()
  )
  .subscribe(console.log);
```

### scan

- reduce와 비교해보면
  reduce는 결과만 발행하지만, scan은 과정을 모두 발행한다.

### zip

- `observable`을 만들어내는 operator이다. 그래서 `rxjs.operator`에서 import하지않고 `rxjs`자체에서 import함
- zip연산자에 넘겨준 observable의 길이가 다른 경우, 길이가 가장 짧은 배열의 길이만큼 생성된다.

```js
const obs1$ = from([1, 2, 3, 4, 5]);
const obs2$ = from(["a", "b", "c", "d", "e"]);

zip(obs1$, obs2$).subscribe(console.log);
```

위 코드의 실행결과는
`[1, "a"]`
`[(2, "b")]`
`[(3, "c")]`
`[(4, "d")]`
`[(5, "e")]`
