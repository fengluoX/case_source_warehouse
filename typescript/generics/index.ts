type Identity<T>=T[];

function loggingIdentity<T>(arg:T):Identity<T>{
    return [arg];
}

loggingIdentity('string');

// interface GenericIdentity<T>{
//     identity:(arg:T)=>T;
//     list:T[]
// }



// const identityMap:GenericIdentity<number> = {
//     identity:(arg)=>arg,
//     list:[1,2,3]
// }

interface GenericIdentity<T = number>{
    identity:(arg:T)=>T;
    list:T[]
}

const identityMap:GenericIdentity = {
    identity:(arg)=>arg,
    list:[1,2,3]
} 

interface SearchFunc {
    (source: string, subString: string): boolean;
}
// ^ = type SearchFunc = (source: string, subString: string)=> boolean;

class BeeKeeper {
    hasMask: boolean;
}

class ZooKeeper {
    nametag: string;
}

class Animal {
    numLegs: number;
}

class Bee extends Animal {
    keeper: BeeKeeper;
}

class Lion extends Animal {
    keeper: ZooKeeper;
}

function createInstance<A extends Animal>(c: new () => A): A {
    return new c();
}

createInstance(Lion).keeper.nametag;
createInstance(Bee).keeper.hasMask;
