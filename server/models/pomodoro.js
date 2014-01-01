var env = process.env;
var textMessage = require('./textMessage');
var history = require('./history');
var currentPomodoroTask = { };
var currentPomodoroBreak = { };
var pomodoroLength = 25;
var breakLength = 7;

function startTask(description) {
  clearBreak();
  currentPomodoroTask = {
    title: description,
    startTime: new Date(),
    endTime: new Date(new Date().getTime() + minutes(pomodoroLength))
  };

  history.saveTask(currentPomodoroTask);

  textMessage.send(currentPomodoroTask.title + " started at " + new Date());
}

function startBreak() {
  textMessage.send("take a break!");

  clearTask();
  currentPomodoroBreak = { 
    startTime: new Date(),
    endTime: new Date(new Date().getTime() + minutes(breakLength))
  };
}

function backToWork() {
  textMessage.send("back to work!");

  clearTask();
  clearBreak();
}

function clearAll() {
  textMessage.send("done.");

  clearTask();
  clearBreak();
}

function currentBreak() {
  currentPomodoroBreak.minutesLeft = (currentPomodoroBreak.endTime - new Date()) / minutes(1);
  return currentPomodoroBreak;
}

function minutes(value) {
  return 1000 * 60 * value;
}

function currentTask() {
  currentPomodoroTask.minutesLeft = (currentPomodoroTask.endTime - new Date()) / minutes(1);
  return currentPomodoroTask;
}

function isWorkingOnTask() {
  return currentTask().startTime;
}

function isOnBreak() {
  return currentBreak().startTime;
}

function clearTask() {
  currentPomodoroTask = { };
}

function clearBreak() {
  currentPomodoroBreak = { };
}

function tick() {
  if(isWorkingOnTask()) {
    if(currentTask().minutesLeft <= 0) {
      startBreak();
    }
  }

  if(isOnBreak()) {
    if(currentBreak().minutesLeft <= 0) {
      backToWork();
    }
  }
}

module.exports.startTask = startTask;
module.exports.currentTask = currentTask;
module.exports.currentBreak = currentBreak;
module.exports.isWorkingOnTask = isWorkingOnTask;
module.exports.isOnBreak = isOnBreak;
module.exports.startBreak = startBreak;
module.exports.tick = tick;
module.exports.clearAll = clearAll;