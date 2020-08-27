type NetworkLoadingState = {
    success:boolean;
    code:string;
    data:{
        list:string[]
    }
}

type NetWorkFailedState = {
    success?:boolean;
    code:number
}


type NetworkState = NetWorkFailedState&NetworkLoadingState;

const foo = {
    foo:'foo',
    common:123
}
// let bar:typeof foo;

let bar:{
    foo:string;
    common:number;
}

interface Car {
    manufacturer:string;
    model:string;
    year:number;
}
// let carProps:keyof Car;
let carProps:'manufacturer'|'model'|'year';

interface SuperType {
    name:string;
}

interface ColorType {
    color:string
}

interface SubType extends SuperType,ColorType {
    age:number;
}
