#!/usr/bin/env node

import { spawn } from "child_process";
import chokidar from "chokidar";
import fs from "fs";
import path from "path";


const routesPath = path.join(process.cwd(), "src", "routes");
const importRoot = "@/src/routes";
const ROUTE_METHODS = ["get", "post", "put", "patch", "delete"];

export interface CODE {
  import: string;
  functionNames: string[];
  paramsNames: string[];
  route: string;
  isValid: boolean;
}

let codeObject: CODE[] = [];

const routesGenerator = async (rootPath: string) => {
  try {
    const files = (await fs.promises.readdir(rootPath)).sort().reverse();

    await Promise.all(
      files.map(async (fileFolder) => {
        if (fileFolder.startsWith("_")) {
          return;
        }
        const filePath = path.join(rootPath, fileFolder);
        const stats = await fs.promises.stat(filePath);
        if (stats.isDirectory()) {
          await routesGenerator(filePath);
        } else if (stats.isFile()) {
          const { functionNames, paramsNames } = parser(filePath);

          const projectFilePath = filePath
            .split(path.join("src", "routes"))
            .pop();
          if (functionNames.length === 0 || !projectFilePath) {
            return;
          }
          const routePath = convertPathToUrl(projectFilePath);

          const object = {
            import: `${importRoot}${projectFilePath.replace(/\\/g, "/")}`,
            functionNames,
            paramsNames,
            route: routePath,
            isValid: isValidRoutePath(routePath),
          };
          codeObject.push(object);
        }
      })
    );

    return codeObject;
  } catch (error) {
    console.error("Error generating routes:", error);
    throw error;
  }
};

function isValidRoutePath(path: string) {
  const routeRegex =
    /^\/(?:[a-zA-Z0-9._~:-?]+|:[a-zA-Z0-9_?]+)?(?:\/(?:[a-zA-Z0-9._~:-?]+|:[a-zA-Z0-9_?]+)?)*\/?$/;
  return routeRegex.test(path);
}

const parser = (filePath: string) => {
  const functionNames = getFunctionNamesFromFile(filePath);
  const paramsNames = extractAndValidateBracketsContent(filePath);
  return { functionNames, paramsNames };
};

const extractAndValidateBracketsContent = (filePath: string) => {
  const matches = [...filePath.matchAll(/\[([^\]]+)\]/g)].map((match) =>
    match[1].trim()
  );

  // Check for duplicates
  const uniqueValues = new Set(matches);
  if (uniqueValues.size !== matches.length) {
    throw new Error(`Duplicate route params found in file: ${filePath}`);
  }
  return matches;
};

const getFunctionNamesFromFile = (filePath: string) => {
  try {
    const fileContent = fs.readFileSync(filePath, "utf8");

    // Remove Comments
    const uncommentedCode = fileContent
      .split("\n")
      .filter((line) => !line.trim().startsWith("//"))
      .join("\n");

    const functionRegex = /export\s+(?:const|function|async function)\s+(\w+)/g;

    const functionNames = [];
    let match;
    // Get The Function Names Exports From The File
    while ((match = functionRegex.exec(uncommentedCode)) !== null) {
      functionNames.push(match[1].trim());
    }

    return functionNames.filter((name) =>
      ROUTE_METHODS.includes(name.toLocaleLowerCase())
    );
  } catch (error) {
    console.error("Error reading file:", error);
    return [];
  }
};

const convertPathToUrl = (filePath: string) => {
  let parts = filePath.split(path.sep);

  if (parts[parts.length - 1].startsWith("index.")) {
    parts.pop();
  } else {
    parts[parts.length - 1] = parts[parts.length - 1].replace(/\.[^/.]+$/, "");
  }

  parts = parts.map((part) =>
    part.replace(/\[(.+?)\]/g, (_, param) =>
      param.endsWith("_") ? `:${param.slice(0, -1)}?` : `:${param}`
    )
  );

  let url = parts.join("/");
  if (url.trim().length == 0) {
    url = "/";
  }

  return url;
};

const writeCode = (code: CODE[]) => {
  let output = `import { Router } from "express";\nconst router = Router();\n`;

  code.forEach((item, i) => {
    output += `
//Route Group ${item.route} ${item.isValid ? " ✅" : " ❌ invalid route path Not Allow On Run"
      }
${item.isValid ? "" : "//"}import * as routes${i} from '${item.import}'; 
`;
    item.functionNames.forEach((func) => {
      output += `${item.isValid ? "" : "//"}router.${func.toLowerCase()}("${item.route
        }", routes${i}.${func});\n`;
    });
  });

  output += `\nexport default router;\n`;

  fs.writeFileSync(
    path.join(process.cwd(), "generated", "routes.g.ts"),
    output
  );
};

export const makeRoutes = async () => {
  try {
    console.log("♻️  Generating routes...");
    const code = await routesGenerator(routesPath);
    codeObject = [];
    writeCode(code);
    console.log("🎉 Routes generated successfully!");
  } catch (error) {
    codeObject = [];
    console.error("Error generating and writing routes:", error);
  }
};

export const runner = async () => {
  console.clear();
  const regenerateRoutes = async () => {
    await makeRoutes();
  };

  chokidar
    .watch(path.join(process.cwd(), "src", "routes"), {
      ignored: (filePath) => /node_modules|\.git|\/_.*/.test(filePath),
      ignoreInitial: true,
    })
    .on("change", async (file) => {
      const name = file.split(path.sep).reverse()?.[0] || "";
      if (name != "routes.d.ts") {
        console.log(`File changed: ${name}. Restarting server...`);
        regenerateRoutes();
      }
    })
    .on("unlink", async (file) => {
      const name = file.split(path.sep).reverse()?.[0] || "";
      console.log(`File deleted: ${name}. Regenerating routes...`);
      regenerateRoutes();
    })
    .on("error", (error) => {
      console.error("Chokidar error:", error);
    });

  // Initial route generation and start the server
  try {
    await makeRoutes();
    const isWin = process.platform === "win32";
    const cmd = isWin ? "npm.cmd" : "npm";
    const args = ["run", "watch:dev"];

    spawn(cmd, args, { stdio: "inherit", shell: true });
  } catch (err) {
    console.error(err);
  }
};
