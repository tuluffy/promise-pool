type Transaction = () => Promise<unknown>;

type Dispatch = (transaction: Transaction) => void;

declare function assert(value: unknown): asserts value;

const noop = () => void 0;

export default function promisePool (
	limit: number = Infinity	/* limit concurrency */,
	callback: (params: unknown[]) => void = noop	/* communication */,
): Dispatch {
	const queue: Transaction[] = [];
	let count = 0; /* number of transactions in progress */

	/* Index relation of transaction: [transaction, index], help to return execution results in sequence */
	const indexMap = new Map<Transaction, number>();
	let index = 0; /* Index */

	const result: unknown[] = []; /* the execution result is returned in the original request order */

	/**
	 * core
	 * @param transaction
	 */
	const dispatch = (transaction: Transaction): void => {
		if(typeof transaction !== 'function') {
			throw Error('transaction not a function');
		};

		if (!indexMap.has(transaction)) {
			indexMap.set(transaction, index++); /* preset Index */
		}

		/* if there are free resources, the request can be processed immediately */
		if (count < limit) {
			count++;
			const index = indexMap.get(transaction)!;

			Promise.resolve(transaction())
				.then(data => {
					result[index] = data;
				})
				.catch((err: Error) => {
					result[index] = err;
				})
				.finally(() => {
					count--; /* release resources after each request is executed */

					if (queue.length) {
						/* the request to extract the queue header enters execution */
						dispatch(queue.shift()!);
					} else {
						callback(result); /* completion of all requests: Dispatch Data */
					}
				});
		} else {
			/* if there are no free resources, temporarily store transactions in the pool */
			queue.push(transaction);
		}
	}

	return dispatch;
};
