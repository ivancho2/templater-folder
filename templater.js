// Execute this script for make a template folder and a files
// -- node templater.js

// TODO: refactor code
// NOT SUPPORT FOR [ '-' ] INTO NAME FILE/FOLDERS

const fs = require('fs');
const path = require('path');
const typeSplit =
  process.platform.includes('win32') || process.platform.includes('win64')
    ? '\\'
    : '/';
const folderStructure = `
/src
-/common
--.gitkeep
-/utils
--.gitkeep
-/assets
--/images
---.gitkeep
--/fonts
---.gitkeep
-/components
--/atoms
---.gitkeep
--/molecules
---.gitkeep
--/organisms
---.gitkeep
--/templates
---.gitkeep
-/constants
--.gitkeep
-/styles
--colors.js
--variables.js
--mixins.js
-/environments
--.env.dev
--.env.pdn
`
  .split(/\n/)
  .slice(1, -1);

linesIterator(
  folderStructure[0].trim(),
  folderStructure.slice(1),
  path.join(__dirname),
);

function linesIterator(current, iterator, depthPath) {
  let next = iterator[0];
  if (!next || !current) {
    console.log(`
    ===================================================
    ================= Template created ================
    ===================================================
    `);
    return;
  }
  next = next.trim();
  // nested element?
  if (depthCalc(current) < depthCalc(next)) {
    try {
      fs.mkdir(`${depthPath}${typeSplit}${getName(current)}`, error => {
        handleError(error);
        return linesIterator(
          next,
          iterator.slice(1),
          `${depthPath}${typeSplit}${getName(current)}`,
        );
      });
    } catch (error) {
      throw error;
    }
  } else {
    if (isFolder(current)) {
      try {
        fs.mkdir(`${depthPath}${typeSplit}${getName(current)}`, error => {
          handleError(error);
        });
      } catch (error) {
        throw error;
      }
    } else {
      try {
        fs.appendFile(
          `${depthPath}${typeSplit}${getName(current)}`,
          '',
          error => {
            if (error) throw error;
          },
        );
      } catch (error) {
        throw error;
      }
    }
    linesIterator(
      next,
      iterator.slice(1),
      depthCalc(current) > depthCalc(next)
        ? `${depthPathDecrease(
            depthPath,
            depthCalc(current) - depthCalc(next),
          )}`
        : `${depthPath}`,
    );
  }
}

function depthPathDecrease(pathToDecrease, iterations) {
  while (iterations > 0) {
    --iterations;

    pathToDecrease = pathToDecrease
      .split(typeSplit)
      .slice(0, -1)
      .join(typeSplit);
  }
  return pathToDecrease;
}

function depthCalc(line) {
  return (line.match(/-/g) || []).length;
}

function isFolder(line) {
  return (line.match(/\//g) || []).length > 0;
}

function getName(line) {
  // TODO: add character '-' to name-folders
  return line.split(/[\/-]+/).pop();
}

function handleError(error) {
  if (error) {
    if (error.code === 'EEXIST') {
      // https://stackoverflow.com/questions/9781218/how-to-change-node-jss-console-font-color
      // https://en.wikipedia.org/wiki/ANSI_escape_code#Colors
      console.log(
        `\x1b[94mINFO:\x1b[m '${error.path}' \x1b[33malready exist\x1b[m`,
      );
    } else {
      throw error;
    }
  }
}
