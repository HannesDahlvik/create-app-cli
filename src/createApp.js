const inquirer = require('inquirer')
const chalk = require('chalk')
const fse = require('fs-extra')
const path = require('path')

function init() {
    inquirer
        .prompt([{
                type: 'input',
                message: 'Enter project name',
                name: 'dir'
            },
            {
                type: 'list',
                message: 'Select type of project',
                name: 'type',
                choices: [{
                        name: 'React app with parcel',
                        value: 'react-app-parcel'
                    },
                    {
                        name: 'Express server with mongodb',
                        value: 'express-app-mongodb'
                    }
                ]
            }
        ])
        .then((values) => {
            createApp(values)
        })
        .catch((err) => {
            console.error(err)
        })
}

function createApp(vals) {
    const root = path.resolve(vals.dir)

    if (vals.dir !== '') {
        fse.ensureDir(vals.dir)
    } else {
        process.exit(1)
    }

    if (vals.type) {
        fse.copy(path.join(__dirname, `/templates/${vals.type}/template`), root)
            .then(() => {
                console.log(`
                
    Made a new ${chalk.cyanBright(`"${vals.type}"`)} in ${chalk.cyanBright(`"${vals.dir}"`)}

    Make sure to ${chalk.cyanBright(`"cd ${vals.dir}"`)} and run ${chalk.cyanBright(`"yarn"`)} or ${chalk.cyanBright(`"npm install"`)}

    Happy coding!
                
                `)
            })
            .catch((err) => console.error(err))
    } else {
        process.exit(1)
    }
}

module.exports = {
    init
}