# Why this code?
I need grouping support for setTimeout/setInterval.

# Usage example:

function test1(){
    console.log("Test1 run");
}
function test2(){
    console.log("Test2 run");
}

TaskGroupQueue.add("a",test1,1000); // start function test1 once after 1000 ms in group "a"
TaskGroupQueue.add("a",test1,1000, 1); // start function test1 once after 1000 ms in group "a"
TaskGroupQueue.add("a",test1,1000, 0); // start function test1 once after 1000 ms in group "a"
TaskGroupQueue.add("a",test1,1000, null); // start function test1 once after 1000 ms in group "a"
TaskGroupQueue.add("a",test1,1000, false); // start function test1 once after 1000 ms in group "a"
TaskGroupQueue.add("a",test1,1000, undefined); // start function test1 once after 1000 ms in group "a"

TaskGroupQueue.add("a",test2,1000,-1); // start function test2 infinitly (like setInterval) with period 1000 ms in group "a"

TaskGroupQueue.add("b",test1,2000, 5); // start function test1 once 5 times with period 2000 ms in group "b"

setTimeout(function() {
  TaskGroupQueue.clear("a"); // stop all tasks in group "a" and clear group queue "a"
},30000); // after 30 seconds
