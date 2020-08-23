
export type Props = 'TS' | 'JS';

export interface IProps {
    name: string;
    age: number;
}


class Animal {

    private variety: string;

    public age: number;

    constructor(age: number, variety: string) {
        this.age = age;
        this.variety = variety;
    }

    move(distanceInMeters: number = 0) {
        console.log(`Animal moved ${distanceInMeters}`);
    }
}

class Dog extends Animal {


    protected type: string = 'Dog';

    public message: string = 'Woof!';

    constructor(variety: string, age: number) {
        super(age, variety);
    }

    sayHi() {
        console.log(this.message);
    }
}

let greeter = new Dog('Siberian Husky', 3);

let x: [string, number];

x = ['hello', 10] // OK

enum EColor {
    Red,
    Yellow = 2,
    Green,
    Blue = 'Blue',
}

const handleClick:Function =()=>{}

function handleSelect(e:Event):string{
    return 'Hello Ts'
}

const handleChecked:(checked:boolean,record:boolean[])=>boolean = (checked,record)=>{
    return true
}
