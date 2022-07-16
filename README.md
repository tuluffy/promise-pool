# Promise Pool
**Promise-Pool is a JavaScript library for Scheduling requests.** 

specifying the number of concurrent requests, and reducing the pressure on target services.

## Installation
#### Using npm/yarn:
```shell
npm install @tuluffy/promise-pool --save
```

## How to use
#### test example
```javascript
const fn1 = () => new Promise((resolve, reject) => {
	setTimeout(() => {
		resolve('fn1...');
	}, 1700);
});

const fn2 = () => new Promise((resolve, reject) => {
	setTimeout(() => {
		reject('reject fn2...');
	}, 1000);
});

const fn3 = () => new Promise((resolve, reject) => {
	setTimeout(() => {
		resolve('fn3...');
	}, 800);
});

const fn4 = () => new Promise((resolve, reject) => {
	setTimeout(() => {
		reject('reject fn4...');
	}, 500);
});
```
#### use in project
```javascript
import promisePool from '@tuluffy/promise-pool';

/* (Optional) Process response */
const callback = data => {
	console.log(data);
};

/* The number of transactions is limited to：2 */
const dispatch = PromisePool(2, callback);

const fn0 = () => new Promise((resolve, reject) => {
	setTimeout(() => {
		resolve('fn0...');
	}, 600);
});

dispatch(fn0);
dispatch(fn1);
dispatch(fn2);
dispatch(fn3);
dispatch(fn4);
```

## Change Log
### 1.0.1 (July 16, 2022)

- adjustment readme；

## Follow Up
#### [Why should I make this tool?](https://mp.weixin.qq.com/s/_rbXzuODCtQIP6nafpFi8A)
