const EventEmitter=require('events')
class MyEmitter extends EventEmitter{
    constructor(){
        super();
    }
};
const userEventEmitter=new MyEmitter();
userEventEmitter.on('AppliedForOpening',(userApplied)=>{
console.log(userApplied+" Employee applied for the opening ***********");
})
userEventEmitter.on('openingClosed',(updateOpening)=>{
console.log(updateOpening._id+" is closed notify all "+updateOpening.employeesApplied+" *******");
})
module.exports=userEventEmitter