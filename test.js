// const a = {}
// class JXL {
//     constructor(){
//         this.a = 1;
//     }
// }
// export const obj = {};
// export const j = new JXL();

const deepCopyObj = function (obj) {
    if (typeof obj !== "object" || obj === null) {
        return obj;
    }
    //   let newObj = {};
    let newObj = new obj.constructor();

    for (let key in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, key)) {
            newObj[key] = (typeof obj[key] === "object") ? arguments.callee(obj[key]) : obj[key]
        }

    }
    return newObj;
};
const mergeCopyObj = function (obj, newObj) {

    const merge = (obj, nobj) => {
        if (typeof obj !== 'object' || obj === null) {
            return nobj;
        }
        if (typeof nobj !== 'object' || nobj === null) {
            obj = nobj;
        }
        for (let key in nobj) {
            if (typeof obj[key] === 'object' && obj[key] != null) {
                obj[key] = merge(obj[key], nobj[key]);
            } else {
                obj[key] = nobj[key];
            }
        }
        return obj;
    }
    merge(obj, newObj)

}
let oldobj = {
    a: 1,
    b: {
        c: [1, 2],
        d: 5,
        f: null,
    },
};
let nobj = {
    a: 99,
    zz: 88,
    b: {
        g: 100,
        f: {
            u: 1
        },
        c: [{
            a: 1
        }, 2, 3]
    }
}
mergeCopyObj(oldobj, nobj)
console.log(JSON.stringify(oldobj));
nobj.b.c[1] = 9999;

console.log(JSON.stringify(oldobj));
// let nObj = deepCopyObj(oldobj);
// console.log("nobj:", nObj);
// nObj.b.c[0] = 999;
// console.log("nobj:", nObj);
// console.log("old:", oldobj);