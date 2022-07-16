"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const noop = () => void 0;
function promisePool(limit = Infinity /* limit concurrency */, callback = noop /* communication */) {
    const queue = [];
    let count = 0; /* number of transactions in progress */
    /* Index relation of transaction: [transaction, index], help to return execution results in sequence */
    const indexMap = new Map();
    let index = 0; /* Index */
    const result = []; /* the execution result is returned in the original request order */
    /**
     * core
     * @param transaction
     */
    const dispatch = (transaction) => {
        if (typeof transaction !== 'function') {
            throw Error('transaction not a function');
        }
        ;
        if (!indexMap.has(transaction)) {
            indexMap.set(transaction, index++); /* preset Index */
        }
        /* if there are free resources, the request can be processed immediately */
        if (count < limit) {
            count++;
            const index = indexMap.get(transaction);
            Promise.resolve(transaction())
                .then(data => {
                result[index] = data;
            })
                .catch((err) => {
                result[index] = err;
            })
                .finally(() => {
                count--; /* release resources after each request is executed */
                if (queue.length) {
                    /* the request to extract the queue header enters execution */
                    dispatch(queue.shift());
                }
                else {
                    callback(result); /* completion of all requests: Dispatch Data */
                }
            });
        }
        else {
            /* if there are no free resources, temporarily store transactions in the pool */
            queue.push(transaction);
        }
    };
    return dispatch;
}
exports.default = promisePool;
;
