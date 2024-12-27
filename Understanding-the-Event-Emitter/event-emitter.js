/*
  A brief  overview of how the eventlistener works  


  My own custom implementation of the Node.js EventEmitter object 
*/


const eventEmitter = require('events');

class MyEventEmitter {
  listener = {};

  constructor() {}

  on(event_name, callback) {
    this.listener[event_name] = callback;
    return this.listener;
  }

  emit(event_name) {
    const fn = this.listener[event_name];
    return fn();
  }
}

// class MyArray {
//   arrayDict = {};

//   constructor(...args) {
//     let index = 0;
//     this.arrayDict = {}
//   }

// }


// new Array("5", "joshua");

// let myArray = {
//   0: "5",
//   1: "Joshua"
// }