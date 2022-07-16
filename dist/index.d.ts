declare type Transaction = () => Promise<unknown>;
declare type Dispatch = (transaction: Transaction) => void;
export default function promisePool(limit?: number, callback?: (params: unknown[]) => void): Dispatch;
export {};
//# sourceMappingURL=index.d.ts.map