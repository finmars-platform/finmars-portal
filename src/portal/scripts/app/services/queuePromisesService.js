/**
 * Created by mevstratov on 2022-06-07.
 */

'use strict';

export default function () {

    let queue = [];

    const dequeue = function () {

        const promiseData = queue.shift();

        if (!promiseData) return false;

        if (promiseData.inProgress) return false;

        try {

            promiseData.inProgress = true;

            promiseData.promise()
                .then(resData => {

                    promiseData.inProgress = false;
                    promiseData.resolve(resData);
                    dequeue();

                })
                .catch(error => {
                    promiseData.inProgress = false;
                    promiseData.reject(error);
                    dequeue();
                })

        } catch (error) {
            promiseData.inProgress = false;
            promiseData.reject(error);
            dequeue();
        }

    };

    const enqueue = function (promise) {
        return new Promise((resolve, reject) => {
            queue.push({
                promise: promise,
                resolve: resolve,
                reject: reject,
                inProgress: false
            });
            dequeue();
        });
    }

    return {
        enqueue: enqueue,
        queue: queue
    }

}