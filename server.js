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

const viewEmployees = async () => {
    const results = await db.promise().query("SELECT * FROM employee;")
    if (results) {
        console.table(results[0]);
    }
}
const viewAllRoles = async () => {
    const results = await db.promise().query("SELECT * FROM role;")
    if (results) {
        console.table(results[0]);
    }
}
const viewAllDepartments = async () => {
    const results = await db.promise().query("SELECT * FROM department;")
    if (results) {
        console.table(results[0]);
    }
}
const addRole = async () => {
    const data = await db.promise().query("INSERT * FROM department;")
    console.log(data);
    const deptChoices = data[0].map(({ id, name }) => ({ name: name, value: id }))

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
            name: "addRole"
        }
    ])
    console.log(results);
}
// Query database
const run = async () => {
    let appRunning = true;

    while (appRunning) {
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
                "Remove employee",
                "Remove role",
                "Quit application"
            ]
        },

    ])
    if (results.menu === "View all employees") {
        viewEmployees();
    }
    if (results.menu === "View all roles") {
        viewAllRoles();
    }
    if (results.menu === "View all departments") {
        viewAllDepartments();
    }
    if (results.menu === "Add role") {
        addRole();
    }




    /* while (appRunning) {
        await menu(); */

        const { shouldContinue } = await inquirer.prompt({
            type: "confirm",
            message: "Do you want to continue this app?",
            name: "shouldContinue"
        });
        appRunning = shouldContinue;
    }
};
run();