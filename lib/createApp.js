const inquirer = require('inquirer');

const chalk = require('chalk');

const Spinner = require('cli-spinner').Spinner;

const fse = require('fs-extra');

const path = require('path');

const ch = require('child_process');

async function init() {
  const templates = fse.readdirSync(path.join(__dirname, '/templates'));
  let typeChoices = [];

  for (const templateName of templates) {
    await fse.readJSON(path.join(__dirname, `/templates/${templateName}/template.json`)).then(templateJson => {
      typeChoices.push({
        name: templateJson.name,
        value: templateJson.value
      });
    }).catch(err => console.error(err));
  }

  inquirer.prompt([{
    type: 'input',
    message: 'Enter project name',
    name: 'name'
  }, {
    type: 'list',
    message: 'Select type of project',
    name: 'type',
    choices: typeChoices
  }, {
    type: 'list',
    message: 'Select package manager',
    name: 'manager',
    choices: [{
      name: 'yarn',
      value: 'yarn'
    }, {
      name: 'npm',
      value: 'npm'
    }]
  }]).then(values => {
    createApp(values.name, values.type, values.manager);
  }).catch(err => {
    console.error(err);
  });
}

function createApp(name, type, manager) {
  const root = path.resolve(name);
  if (name !== '') fse.ensureDir(name);else process.exit(1);

  if (type) {
    fse.copy(path.join(__dirname, `/templates/${type}/template`), root).catch(err => console.error(err));
  } else process.exit(1);

  if (manager) {
    const spinner = new Spinner(`Installing packages with ${chalk.cyan(`"${manager}"`)}`);
    spinner.start();
    if (manager === 'yarn') installWithYarn(root, type, name, spinner);
    if (manager === 'npm') installWithNpm(root, type, name, spinner);
  } else process.exit(1);
}

function installWithYarn(root, type, name, spinner) {
  ch.exec('yarn', {
    cwd: root
  }).addListener('close', () => {
    logCreatedProject(type, name);
    spinner.stop();
  });
}

function installWithNpm(root, type, name, spinner) {
  ch.exec('npm install', {
    cwd: root
  }).addListener('close', () => {
    logCreatedProject(type, name);
    spinner.stop();
  });
}

function logCreatedProject(type, name) {
  console.log(`


    Made a new ${chalk.cyan(`"${type}"`)} inside ${chalk.cyan(`"${name}"`)}

    Make sure to ${chalk.cyan(`"cd ./${name}"`)} and

    Happy coding!

    `);
}

module.exports = {
  init
};