module.exports = {
    unexclude (f) {
        if (f.constructor === Array) {
            return f.map(unexclude);
        }
        return f._$_mutually_exclusive_functions_$_target;
    },
    exclude (functions) {
        let queue = [];

        return functions.map(f => {
            return new Proxy(f, {
                get(target, prop) {
                    if (prop === "_$_mutually_exclusive_functions_$_target") {
                        return target;
                    } else {
                        return target[prop];
                    }
                },
                apply: (target, that, args) => {
                    let x = new Promise(async (resolve, reject) => {
                        await queue[queue.length-1];
                        queue.shift();
                        return resolve(target.apply(that, args));
                    });
                    queue.push(x);
                    return x;
                }
            })
        })
    }
}