/**
 * MIT License.
 */

const TaskGroupQueue = (function(){ // singleton. Assuming you only need one copy of timed queue
    var API;                // internal referance to interface
    const queue = {};       // array to hold functions
    var task = {};        // the next task to run
    var tHandle = {};            // To stop pending timeout
    const defaultGroup = "";
    var running = {defaultGroup:false};
    var next = function(group){  // runs current scheduled task and  creates timeout to schedule next
        if(task[group]){          // is task scheduled??
            task[group].func();            // run it
            task[group].repeatCount--;
            if (task[group].repeatCount != 0) {
                if (task[group].repeatCount < 0) {
                    task[group].repeatCount = -1;
                }
                queue[group].push(task[group]);
            }
            delete task[group];            // clear task
        }
        while (queue[group].length > 0) {
            task[group] = queue[group].shift();   // yes set as next task
            if (task[group] && task[group].repeatCount != 0) {
                break;
            }
        }
        if(task[group]){       // are there any remain tasks??
            tHandle[group] = setTimeout(next.bind(null,group),task[group].time); // schedual when
        }else{
            API.clear(group);
        }
    };
    var start = function(group){
        if(queue[group].length > 0 && !running[group]){
            running[group] = true;   // set state flag
            tHandle[group] = setTimeout(next.bind(null,group),0);
        }
    };
    return API = {
        addGlobal: function(func,time,repeatCount){
            return API.add(null,func,time,repeatCount);
        },
        add: function(group,func,time,repeatCount){
            if (!group) { group = defaultGroup; }
            if (!queue[group]) {
                queue[group] = [];
            }
            if (repeatCount === undefined || repeatCount === false || repeatCount === null || repeatCount === 0) {
                repeatCount = 1; // once, like setTimeout
            } else if (repeatCount < 0) {
                repeatCount = -1; // infinite, like setInterval
            }
            queue[group].push({func : func, time: time, repeatCount: repeatCount});
            start(group);
        },
        clear: function(group){
            if (!group) { group = defaultGroup; }
            delete task[group];            // remove pending task
            if (queue[group]) {
                queue[group].length = 0;       // empty queue
                delete queue[group];
            }
            if (tHandle[group]) {
                clearTimeout(tHandle[group]);  // clear timeout
                delete tHandle[group];
            }
            running[group] = false;        // set state flag
        },
        isRunning: function(group) {
            return running[group];
        }
    }
})();
