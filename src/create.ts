#!/usr/bin/env node

import { execSync } from "child_process";

import degit from "degit";

import path from "path";

import fs from "fs";

import inquirer from "inquirer";

import ora from "ora";

import chalk from "chalk";

import { fileURLToPath } from "url";

// Fix for __dirname in ESM

const __filename = fileURLToPath(import.meta.url);


export const createApp = async () => {
  console.log(chalk.bold.cyan("\nWelcome to create-monpress-app! 🚀\n"));

  // Ask for project name if not provided

  const { projectName } = await inquirer.prompt([
    {
      type: "input",

      name: "projectName",

      message: "What is your project name?",

      validate: (input) => (input ? true : "Project name cannot be empty!"),
    },
  ]);

  const projectPath = path.join(process.cwd(), projectName);

  // Check if directory already exists

  if (fs.existsSync(projectPath)) {
    console.error(
      chalk.red(`\nError: Directory "${projectName}" already exists!`)
    );

    process.exit(1);
  }

  // Ask for the package manager

  const { packageManager } = await inquirer.prompt([
    {
      type: "list",

      name: "packageManager",

      message: "Choose your package manager:",

      choices: ["npm", "yarn", "pnpm"],

      default: "npm",
    },
  ]);

  const spinner = ora("Creating your project...").start();

  try {
    // Clone the GitHub repo using degit

    const emitter = degit("souravbapari1/monpress", {
      cache: false,

      force: true,

      verbose: false,
    });

    await emitter.clone(projectPath);

    spinner.succeed(chalk.green("Project files copied!"));

    // Install dependencies

    console.log(chalk.blue("\nInstalling dependencies..."));

    spinner.start();

    execSync(`cd ${projectPath} && ${packageManager} install`, {
      stdio: "inherit",
    });

    spinner.succeed(chalk.green("Dependencies installed!"));

    // Completion message

    console.log(chalk.bold.green("\nSuccess! Your project has been created."));

    console.log(chalk.white(`\nNavigate to your project folder:`));

    console.log(chalk.cyan(`  cd ${projectName}`));

    console.log(chalk.white(`\nStart your development server:`));

    console.log(chalk.cyan(`  ${packageManager} start`));

    console.log(chalk.bold.yellow("\nHappy coding! 🎉"));
  } catch (error: any) {
    spinner.fail(chalk.red("Failed to create the project."));
    process.exit(1);
  }
};
