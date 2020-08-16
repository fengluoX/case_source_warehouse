"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
exports.__esModule = true;
var Animal = /** @class */ (function () {
    function Animal(age, variety) {
        this.age = age;
        this.variety = variety;
    }
    Animal.prototype.move = function (distanceInMeters) {
        if (distanceInMeters === void 0) { distanceInMeters = 0; }
        console.log("Animal moved " + distanceInMeters);
    };
    return Animal;
}());
var Dog = /** @class */ (function (_super) {
    __extends(Dog, _super);
    function Dog(variety, age) {
        var _this = _super.call(this, age, variety) || this;
        _this.type = 'Dog';
        _this.message = 'Woof!';
        return _this;
    }
    Dog.prototype.sayHi = function () {
        console.log(this.message);
    };
    return Dog;
}(Animal));
var greeter = new Dog('Siberian Husky', 3);

console.log(greeter.variety,greeter.age,greeter.type);
