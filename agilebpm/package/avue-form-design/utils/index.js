export function getAsVal(obj, bind = '') {
    let result = deepClone(obj)
    if (validatenull(bind)) return result
    bind.split('.').forEach(ele => {
        if (!validatenull(result[ele])) {
            result = result[ele]
        } else {
            result = ''
        }
    });
    return result
}

export function validatenull(val) {
    if (val instanceof Date || typeof val === 'boolean' || typeof val === 'number' || val instanceof Array) return false;
    else if (val instanceof Function) {
        const fun = val.toString().replace(/\s+/g, '')
        const arr = ['({value})=>{}', '(res,cb)=>{}', '(res)=>{}', '()=>{}']
        if (arr.includes(fun)) return true
        else return false
    } else if (val instanceof Object) {
        for (var o in val) {
            return false;
        }
        return true;
    } else {
        if (
            val === 'null' ||
            val == null ||
            val === 'undefined' ||
            val === undefined ||
            val === ''
        ) {
            return true;
        }
        return false;
    }
}

export const deepClone = data => {
    var type = getObjType(data);
    var obj;
    if (type === 'array') obj = [];
    else if (type === 'object') obj = {};
    else return data;
    if (type === 'array') {
        for (var i = 0, len = data.length; i < len; i++) {
            data[i] = (() => {
                if (data[i] === 0) {
                    return data[i];
                }
                return data[i];
            })();
            if (data[i]) {
                delete data[i].$parent;
            }
            obj.push(deepClone(data[i]));
        }
    } else if (type === 'object') {
        for (var key in data) {
            if (data) {
                delete data.$parent;
            }
            obj[key] = deepClone(data[key]);
        }
    }
    return obj;
};

export const getObjType = obj => {
    var toString = Object.prototype.toString;
    var map = {
        '[object Boolean]': 'boolean',
        '[object Number]': 'number',
        '[object String]': 'string',
        '[object Function]': 'function',
        '[object Array]': 'array',
        '[object Date]': 'date',
        '[object RegExp]': 'regExp',
        '[object Undefined]': 'undefined',
        '[object Null]': 'null',
        '[object Object]': 'object'
    };
    if (obj instanceof Element) {
        return 'element';
    }
    return map[toString.call(obj)];
};

export const loadScript = (type = 'js', url, dom = "body") => {
    let flag = false;
    return new Promise((resolve) => {
        const head = dom == 'head' ? document.getElementsByTagName('head')[0] : document.body;
        for (let i = 0; i < head.children.length; i++) {
            let ele = head.children[i]
            if ((ele.src || '').indexOf(url) !== -1) {
                flag = true;
                resolve();
            }
        }
        if (flag) return;
        let script;
        if (type === 'js') {
            script = document.createElement('script');
            script.type = 'text/javascript';
            script.src = url;
        } else if (type === 'css') {
            script = document.createElement('link');
            script.rel = 'stylesheet';
            script.type = 'text/css';
            script.href = url;
        }
        head.appendChild(script);
        script.onload = function() {
            resolve();
        };
    });
};