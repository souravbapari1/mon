#!/usr/bin/env node
// @ts-check
import { createApp } from "./create.js";
import { makeRoutes, runner } from "./runner.js";
import { Command } from "commander";

const program = new Command();

// Function to handle commands
const handleCommand = async (command: string) => {
  switch (command) {
    case "dev":
      await runner();
      break;
    case "create":
      await createApp();
      break;
    case "generate":
      await makeRoutes();
      break;
    default:
      console.log("Invalid command");
  }
};

// Main function to start the application
const start = async () => {
  const args = process.argv.slice(2); // Get arguments passed after the script name

  if (args.length > 0) {
    const command = args[0];
    try {
      await handleCommand(command);
    } catch (error) {
      console.error("Error executing command:", error);
    }
  } else {
    program.help(); // Show help documentation if no arguments are passed
  }
};

program
  .version("1.0.0")
  .description("CLI tool to create and manage Monpress projects")
  .command("dev", "Start the development server")
  .command("create", "Create a new Monpress project")
  .command("generate", "Generate routes for your project");

start();
