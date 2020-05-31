// 一个并发请求的小demo
const data = [];

for (let i = 1; i < 11; i++) {
    data.push(i);
}

function coustomFunction(data) {
    return new Promise((resolve, reject) => {
        let count = 0, obj = {};
        const runtime = (index, data) => {
            console.log(index);
            obj[index] = data;
            count--;
            if (count === 0) {
                resolve(obj);
            }
        }
        data.forEach((ele, index) => {
            count++;
            console.log(ele);
            middle(ele).then(res => {
                runtime(index, res);
            }).catch(err=>{
                console.log(err,'==')
            })
        })

    })
}

async function middle(ele){
    const res = await PromiseFunction(ele);
    return Promise.resolve(res);
}

function PromiseFunction(i) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            if (i % 2 === 0) {
                resolve(i);
            } else {
                reject(i * 10);
            }
        }, i * 1000)
    })
}

(async function () {
    const res = await coustomFunction(data);
    console.log(res);
})()