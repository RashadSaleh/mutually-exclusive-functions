module.exports = function exclude (functions) {
    let queue = [];
    let pass = Symbol();

    return functions.map(f => {
        return new Proxy(f, {
            apply: (target, that, args) => {

                
                that = {...that, pass};
                
                if (args.includes(pass)) return target.apply(that, args);

                x = new Promise(async (resolve, reject) => {
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