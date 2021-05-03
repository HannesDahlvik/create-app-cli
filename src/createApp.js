const inquirer = require('inquirer')
const chalk = require('chalk')
const fse = require('fs-extra')
const path = require('path')

async function init() {
    const templates = fse.readdirSync(path.join(__dirname, '/templates'))
    let typeChoices = []
    for (const templateName of templates) {
        await fse.readJSON(path.join(__dirname, `/templates/${templateName}/template.json`))
            .then((templateJson) => {
                typeChoices.push({
                    name: templateJson.name,
                    value: templateJson.value
                })
            })
            .catch((err) => console.error(err))
    }

    inquirer
        .prompt([{
                type: 'input',
                message: 'Enter project name',
                name: 'name'
            },
            {
                type: 'list',
                message: 'Select type of project',
                name: 'type',
                choices: typeChoices
            }
        ])
        .then((values) => {
            createApp(values.name, values.type)
        })
        .catch((err) => {
            console.error(err)
        })
}

function createApp(name, type) {
    const root = path.resolve(name)

    if (name !== '') fse.ensureDir(name)
    else process.exit(1)

    if (type) {
        fse.copy(path.join(__dirname, `/templates/${type}/template`), root)
            .then(() => {
                console.log(`
                
    Made a new ${chalk.blueBright(`"${type}"`)} inside ${chalk.blueBright(`"${name}"`)}

    Make sure to ${chalk.blueBright(`"cd ${name}"`)} and run ${chalk.blackBright(`"yarn"`)} or ${chalk.blueBright(`"npm install"`)}

    Happy coding!
                
                `)
            })
            .catch((err) => console.error(err))
    } else process.exit(1)
}

module.exports = {
    init
}