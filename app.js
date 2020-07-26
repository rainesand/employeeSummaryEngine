const Manager = require("./lib/Manager");
const Engineer = require("./lib/Engineer");
const Intern = require("./lib/Intern");
const inquirer = require("inquirer");
const path = require("path");
const fs = require("fs");

const OUTPUT_DIR = path.resolve(__dirname, "output");
const outputPath = path.join(OUTPUT_DIR, "team.html");

const render = require("./lib/htmlRenderer");

async function init(){
    var teamHTML = '';
    var teamSize;
    await inquirer.prompt(
        {
            type: 'number',
            message: 'how many people are on your team?',
            name: 'numMembers'
        }
    )
    .then((data) => {
        teamSize = data.numMembers + 1;
    });
    if (teamSize === 0){
        console.log('why you no have team?');
        return;
    }
    for (i=1;i<teamSize;i++){
        let name;
        let role;
        let id;
        let email;
        await inquirer.prompt([
            {
                type: 'input',
                message: `What is the employee (${i})'s name?`,
                name: 'name'
            },
            {
                type: 'list',
                message: `What is the employee (${i})'s role?`,
                name: 'role',
                choices: ['Engineer','Intern','Manager']
            },
            {
                type: 'input',
                message: `What is the employee (${i})'s id?`,
                name: 'id'
            },
            {
                type: 'input',
                message: `What is the employee (${i})'s email?`,
                name: 'email'
            }
        ])
        .then((data) => {
            name = data.name;
            role = data.role;
            id = data.id;
            email = data.email;
        });
        switch (role){
            case 'Manager':
                await inquirer.prompt([
                    {
                        type: 'input',
                        message: "what is the manager's office number",
                        name: 'officeNum'
                    }
                ])
                .then((data) => {
                    var manager = new Manager(name,id,email,data.officeNum);
                    teamMember = fs.readFileSync('templates/manager.html');
                    teamHTML = teamHTML+'\n'+eval('`'+teamMember+'`');
                });
                break;
            case 'Intern':
                await inquirer.prompt([
                    {
                        type: 'input',
                        message: 'What school is the Intern from?',
                        name: 'school'
                    }
                ])
                .then((data) => {
                    const intern = new Intern(name,id,email,data.school);
                    teamMember = fs.readFileSync('templates/intern.html');
                    teamHTML = teamHTML+'\n'+eval('`'+teamMember+'`');
                });
                break;
            case 'Engineer':
                    await inquirer.prompt([
                        {
                            type: 'input',
                            message: "What is your Engineer's GitHub?",
                            name: 'github'
                        }
                    ])
                    .then((data) => {
                        const engineer = new Engineer(name,id,email,data.github);
                        teamMember = fs.readFileSync('templates/engineer.html');
                        teamHTML = teamHTML+'\n'+eval('`'+teamMember+'`');
                    });
                    break;
        }
    }
    var mainHTML = fs.readFileSync('templates/main.html');
    teamHTML = eval('`'+mainHTML+'`');
    fs.writeFile('output/team.html',teamHTML,function(error){
        if (error){
            return console.log(error);
        }
        console.log('successfully rendered the file');
    });
}
init();
