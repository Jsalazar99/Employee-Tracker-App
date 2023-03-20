// Import and require mysql2
const inquirer = require('inquirer');
const mysql = require('mysql2');
// require('console.table');

// Connect to database
const db = mysql.createConnection(
  {
    host: 'localhost',
    // MySQL username,
    user: 'root',
    // TODO: Add MySQL password
    password: 'Was1212@',
    database: 'employees_db'
  },
  console.log(`Connected to the mySQL database.`)
);

const viewEmployees = async() => {
    const results = await db.promise().query("SELECT * FROM employee;")
    if (results) {
        console.table(results[0]);
    }
}
const addRole = async() => {
    const data = await db.promise().query("SELECT * FROM department;")
    console.log(data);
    const deptChoices = data[0].map(({id, name}) => ({name:name, value:id}))

    const results = await inquirer.prompt([
        {
            type: "input",
            message: "Enter title of role to add?",
            name: "role",
            
        },
        {
            type: "list",
            message: "What department does this role belong to?",
            choices: deptChoices, 

        }
    ])
    console.log(results);
}
// Query database
const menu = async() => {
    const results = await inquirer.prompt([
        {
            type: "list", 
            message: "Welcome to employee tracker app. Please select a task.",
            name: "menu",
            choices: [
                "View all employees",
                "View all roles",
                "View all departments",
                "Add department",
                "Add role",
                "Add employee",
                "Quit application"
            ]
        }, 
        
    ])
    if (results.menu === "View all employees") {
        viewEmployees(); 
    }
    if (results.menu === "Add role") {
        addRole();
    }
}
menu();