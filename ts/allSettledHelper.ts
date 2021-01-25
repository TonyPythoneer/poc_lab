/**
 * Scenario (requirement):
 *   When you don't want to spend time declaring typing,
 *   is there a convenient method for you?
 *
 * Keywords:
 *   Generic type
 *
 * Idea:
 *   Generic type can automationly refer input's typing,
 *   or you can declare your expected types on the function
 */

// mock function
function makeRequest(count = 0) {
    async function req() {
        if (count%2 === 1) return count
        throw count;
    }
    return req();
}


// helper function for ts
function ClassifyAllSettled<F, R = any>(array: PromiseSettledResult<F>[]) {
    const initValue = {
        allFulfilled: [] as Array<F>,
        allRejected: [] as Array<R>,
    };
    const results = array.reduce((results, element) => {
        if (element.status === 'fulfilled') results.allFulfilled.push(element.value);
        else results.allRejected.push(element.reason);
        return results;
    }, initValue);
    return results
}

// main function
type Awaited<T> = T extends PromiseLike<infer U> ? Awaited<U> : T;
async function main() {
    type outputPromise = ReturnType<typeof makeRequest>;

    const reqs: Array<outputPromise> = [];
    for(let i =1; i<=100; i++) {
        reqs.push(makeRequest(i));
    }

    const data = await Promise.allSettled(reqs);
    const { allFulfilled, allRejected } = ClassifyAllSettled(data)
    console.log(allFulfilled);
    console.log(allRejected);
}

main();
