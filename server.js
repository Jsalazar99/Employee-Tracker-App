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
        password: 'mysql123',
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
const viewEmployeesByDept = async () => {
    // Get list of departments
    const [deptRows, _] = await db.promise().query("SELECT * FROM department;");
    const deptChoices = deptRows.map(dept => ({ name: dept.name, value: dept.id }));
    // prompt the user to choose a department
    const { department } = await inquirer.prompt([
        {
            type: 'list',
            name: 'department',
            message: 'Which department do you want to view employees for?',
            choices: deptChoices
        }
    ]);
    // query for employees in specific department
    const [employeeRows, __] = await db.promise().query("SELECT * FROM employee WHERE role_id IN (SELECT id FROM role WHERE department_id = ?);", [department]);
    console.table(employeeRows);
}

const addRole = async () => {
    const [deptRows] = await db.promise().query("SELECT * FROM department;");
    // console.log(data);
    const deptChoices = deptRows.map(({ id, name }) => ({ name: name, value: id }));

    const { title, departmentId } = await inquirer.prompt([
        {
            type: "input",
            message: "Enter title of role to add:",
            name: "title",

        },
        {
            type: "list",
            message: "What department does this role belong to?",
            name: "departmentID",
            choices: deptChoices
        }
    ])
    // Add new role to the database
    const [result,] = await db.promise().query("INSERT INTO role SET ?", { title, department_id: departmentId });
    console.log(`Added new role with ID ${result.insertId}.`);
    // console.log(results);
}

const addDepartment = async () => {
    // Prompt for new department name
    const { departmentName } = await inquirer.prompt([
        {
            type: "input",
            message: "Enter the name of the new department:",
            name: "departmentName",
        },
    ]);
    // Insert new department into database
    const [result,] = await db.promise().query("INSERT INTO department SET ?", { name: departmentName });
    console.log(`Added new department with ID ${result.insertId}.`);
    //console.log(`Added new employee with ID ${result.insertId}.`);
};

const addEmployee = async () => {
    // Query the database to get a list of roles and departments
    const [roleRows] = await db.promise().query("SELECT * FROM role;");
    const [deptRows] = await db.promise().query("SELECT * FROM department;");
    const roleChoices = roleRows.map(({ id, title }) => ({ name: title, value: id }));
    const deptChoices = deptRows.map(({ id, name }) => ({ name: name, value: id }));

    const { firstName, lastName, roleId, managerId, departmentId } = await inquirer.prompt([
        {
            type: "input",
            message: "Enter employee first name:",
            name: "firstName",
        },
        {
            type: "input",
            message: "Enter employee last name:",
            name: "lastName",
        },
        {
            type: "list",
            message: "Select new role:",
            name: "roleId",
            choices: roleChoices,
        },
        {
            type: "input",
            message: "Enter the employee manager ID:",
            name: "managerId",
        },
        {
            type: "list",
            message: "Select new department:",
            name: "departmentId",
            choices: deptChoices,
        },
    ]);
    // Insert new employee into the database
    const [result,] = await db.promise().query("INSERT INTO employee SET ?", { first_name: firstName, last_name: lastName, role_id: roleId, manager_id: managerId, department_id: departmentId });
    console.log(`Added new employee with ID ${result.insertId}.`);
};
// remove an employee
const removeEmployee = async () => {
    // Get list of employees
    const [employeeRows, _] = await db.promise().query("SELECT id, first_name, last_name FROM employee;");
    const employeeChoices = employeeRows.map(employee => ({ name: `${employee.first_name} ${employee.last_name}`, value: employee.id }));
    // prompt the user to choose an employee to remove
    const { employeeId } = await inquirer.prompt([
        {
            type: 'list',
            name: 'employeeId',
            message: 'Which employee do you want to remove?',
            choices: employeeChoices
        }
    ]);
    // delete the employee from the database
    await db.promise().query("DELETE FROM employee WHERE id = ?;", [employeeId]);
    console.log(`Removed employee with ID ${employeeId}.`);
}
// remove a role
const removeRole = async () => {
    // Get list of roles
    const [roleRows, _] = await db.promise().query("SELECT role.id, role.title, department.name FROM role JOIN department ON role.department_id = department.id;");
    const roleChoices = roleRows.map(role => ({ name: `${role.title} (${role.name})`, value: role.id }));
    // prompt the user to choose which role to remove
    const { roleID } = await inquirer.prompt([
        {
            type: 'list',
            name: 'roleID',
            message: 'Which role do you want to remove?',
            choices: roleChoices
        }
    ]);
    // delete the selected role from the database
    await db.promise().query("DELETE FROM role WHERE id = ?;", [roleId]);
    console.log(`Removed role with ID ${roleId}.`);
}
// Query database
const run = async () => {
    let appRunning = true;

    while (appRunning) {

        const results = await inquirer.prompt([
            {
                type: "list",
                message: "Welcome to the Employee Tracker App. Please select a task:",
                name: "menu",
                choices: [
                    "View all employees",
                    "View all roles",
                    "View all departments",
                    "View employees by department",
                    "Add department",
                    "Add role",
                    "Add employee",
                    "Remove employee",
                    "Remove role",
                    "Quit application"
                ]
            },

        ])

        switch (results.menu) {
            case "View all employees":
                await viewEmployees();
                break;
            case "View all roles":
                await viewAllRoles();
                break;
            case "View all departments":
                await viewAllDepartments();
                break;
            case "View employees by department":
                await viewEmployeesByDept();
                break;
            case "Add department":
                await addDepartment();
                break;
            case "Add role":
                await addRole();
                break;
            case "Add employee":
                await addEmployee();
                break;
            case "Remove employee":
                await removeEmployee();
                break;
            case "Remove role":
                await removeRole();
                break;
            case "Quit application":
                appRunning = false;
                // break;
                process.exit(0);
        }
    }
}
run();