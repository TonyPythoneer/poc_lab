/**
 * Scenario (requirement):
 *   When you don't want to spend time declaring typing,
 *   is there a convenient method for you?
 *
 * Keywords:
 *   Generic type
 *
 * Idea:
 *   Generic type can automatically refer input's typing,
 *   or you can declare your expected types on the function
 *
 * Advantages:
 *   - Using type inference from TypeScript
 *   - Users don't spend time to define typings for the input and output
 *   - To reduce human error, for instance, someone forgets declaring typings for the input and output
 *
 */

// mock function
async function req(count = 0) {
    if (count%2 === 1) return count
    throw count;
}


// just a array generator, please skip it
const range = (start: number, stop: number, step: number) => Array.from({ length: (stop - start) / step + 1}, (_, i) => start + (i * step));


/**
 * It just does classify params into `allFulfilled` and `allRejected` for the results of `allSettled`
 *
 * Design idea:
 *   Basically, users don't care the type of `allRejected` and
 *   the type of `allFulfilled` should take sake of Typescript's inference to save time about declaring typing,
 *   so `allRejected` and `allFulfilled` are set the first and second generic types
 *
 *   If they need to reuse `allRejected`,
 *   they can define the type in the first generic type of the function,
 *   and won't redeclare the type of the `allSettled`.
 *
 * Cases:
 *
 *   1. When: You just enjoy the convenience of out of the box from this function
 *      Expected: No typing, just calling.
 *
 *   ```ts
 *   const results = await Promise.allSettled(promises);
 *   const { allFulfilled } = ClassifyAllSettled(results);
 *   ```
 *
 *   2. When: You need to reuse error data from the output
 *      Expected: Just typing for one. The function works as usual.
 *
 *   ```ts
 *   const results = await Promise.allSettled(promises);
 *   const { allRejected } = ClassifyAllSettled<allRejectedType>(results);
 *   ```
 *
 */
function ClassifyAllSettled<R = unknown, F = any>(items: PromiseSettledResult<F>[]) {
    // Your eventual returning variables should be written in heading
    // Likewise, it hints users that these variables have been referring the `generic type`
    const allFulfilled: Array<F> = [];
    const allRejected: Array<R> = [];

    // Just a classification function
    // The detail is not important and can't change the data structure, so it can be written one line.
    items.forEach(item => item.status === 'fulfilled' ? allFulfilled.push(item.value) : allRejected.push(item.reason));
    return {allFulfilled, allRejected};
}


// main function
async function main() {
    const promises = range(1, 100, 1).map((element) => req(element)); // just a lot of promises as an input
    const results = await Promise.allSettled(promises);

    const { allFulfilled, allRejected } = ClassifyAllSettled(results);

    console.log('result:');
    console.log(allFulfilled);
    console.log(allRejected);
}
main();
