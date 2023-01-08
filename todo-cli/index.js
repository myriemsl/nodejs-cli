#!/usr/bin/envv node

const args = process.argv;
const readline = require('readline');
const low = require('lowdb')
const FileSync = require('lowdb/adapters/FileSync')
const adapter = new FileSync('db.json')
const db = low(adapter)
const chalk = require ('chalk');
const figlet = require('figlet');
const gradient = require('gradient-string');


// propmt function
// user can set data
function prompt(question) {
  const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
      terminal: false
  });
  return new Promise((resolve, error) => {
      rl.question(question, answer => {
          rl.close()
          resolve(answer)
      });
  })
}

// help guide
const guide = function() {
    const guideText = `
    ${chalk.magenta('--help guide')}

    ${chalk.bgMagenta('todo commands')}
    
    ${chalk.bgBlueBright('Function')}                   ${chalk.bgBlueBright('Description')}

    add                        add new todo
    get                        list all tasks
    done                       mark completed task
    delete                     delete task
    `
    console.log(guideText);
}

async function todo() {
  figlet(`cli todo app`, (err, data) => {
   console.log(gradient.vice.multiline(data) + '\n');
  })
 }


// log errors
function errorLog(error) {
    const eLog = chalk.red(error)
    console.log(eLog);
}

if (args.length > 3 && args[2] != 'done' ) {
    errorLog('syntax error')
    guide()
    return
}

// set commands
const commands = ['add', 'get', 'done', 'delete', 'help'];
if (commands.indexOf(args[2]) == -1) {
    guide()
}

switch(args[2]) {
    case 'help': 
     guide()
     break
    case 'add':
        addTask()
      break
    case 'get':
        getTask()
      break
    case 'done':
        doneTask()
      break
      case 'delete':
        deleteTask()
      break
    default:
      todo()
}


// set db default
db.defaults({ tasks: []}).write()

// add task
function addTask() {
    const q = chalk.magenta('Type your task\n')
    prompt(q).then(task => {
      db.get('tasks')
        .push({
        task: task,
        isdone: false
        })
        .write()
    })
  }
 
// get tasks
function getTask() {
    const tasks = db.get('tasks').value()
  let index = 1;
  tasks.forEach(task => {
    let taskText = `${index++}. ${task.task}`
    if (task.isdone) {
      taskText += ` ${chalk.blue('done')}`
    }
    console.log(chalk.strikethrough(taskText))
  })
  return
  }

  // set task is done
 function doneTask() {
    // check that length
    if (args.length != 4) {
      errorLog("syntax error")
      return
    }
  
    let n = Number(args[3])
    if (isNaN(n)) {
      errorLog("error, provide a valid number")
      return
    }
  
    let tasksLength = db.get('tasks').value().length
    if (n > tasksLength) {
      errorLog("Failed command. Try again")
      return
    }
  
    db.set(`tasks[${n-1}].isdone`, true).write()
}


// delete task
function deleteTask() {
}