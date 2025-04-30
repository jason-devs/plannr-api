import fs from "fs";
import BackendResource from "./models/backendResourceModel.js";
import Page from "./models/pageModel.js";
import Project from "./models/projectModel.js";
import TechStack from "./models/techStackModel.js";
import UserStory from "./models/userStoriesModel.js";
import User from "./models/userModel.js";

const toCamelCase = function (str) {
  return str
    .toLowerCase()
    .split(" ")
    .map((word, index) =>
      index === 0 ? word : word.charAt(0).toUpperCase() + word.slice(1),
    )
    .join("");
};

const toPascalCase = function (str) {
  return str
    .split(" ")
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join("");
};

const toTitleCase = function (str) {
  return str
    .split(" ")
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
};

const toKebabCase = function (str) {
  return str.toLowerCase().split(" ").join("-");
};

const clearResources = async function () {
  UserStory.deleteMany();
  Page.deleteMany();
  BackendResource.deleteMany();
  Project.deleteMany();
  TechStack.deleteMany();
};

const clearAll = async function () {
  UserStory.deleteMany();
  Page.deleteMany();
  BackendResource.deleteMany();
  Project.deleteMany();
  TechStack.deleteMany();
  User.deleteMany();
};

const writeRouterFile = function (resourceName, parentResourceName) {
  const routerFile = fs
    .readFileSync("./routers/templateRouter.txt", "utf-8")
    .replaceAll("%%VARIABLENAME%%", toCamelCase(resourceName))
    .replaceAll("%%MODELNAME%%", toPascalCase(resourceName))
    .replaceAll("%%PARENTVARIABLENAME%%", toCamelCase(parentResourceName))
    .replaceAll("%%RESOURCENAME%%", toKebabCase(resourceName));

  fs.writeFileSync(
    `./routers/${toCamelCase(resourceName)}Router.js`,
    routerFile,
  );
};

const writeModelFile = function (resourceName, parentResourceName) {
  const modelFile = fs
    .readFileSync("./models/templateModel.txt", "utf-8")
    .replaceAll("%%VARIABLENAME%%", toCamelCase(resourceName))
    .replaceAll("%%MODELNAME%%", toPascalCase(resourceName))
    .replaceAll("%%PARENTVARIABLENAME%%", toCamelCase(parentResourceName))
    .replaceAll("%%PARENTMODELNAME%%", toPascalCase(parentResourceName))
    .replaceAll("%%MODELNAMESPACE%%", toTitleCase(resourceName));

  fs.writeFileSync(`./models/${toCamelCase(resourceName)}Model.js`, modelFile);
};

const writeControllerFile = function (resourceName, parentResourceName) {
  const controllerFile = fs
    .readFileSync("./controllers/templateController.txt", "utf-8")
    .replaceAll("%%VARIABLENAME%%", toCamelCase(resourceName))
    .replaceAll("%%MODELNAME%%", toPascalCase(resourceName))
    .replaceAll("%%PARENTVARIABLENAME%%", toCamelCase(parentResourceName));

  fs.writeFileSync(
    `./controllers/${toCamelCase(resourceName)}Controller.js`,
    controllerFile,
  );
};

if (process.argv[2] === "--clearResources") clearResources();
if (process.argv[2] === "--clearAll") clearAll();

if (process.argv[2] === "--writeFiles") {
  writeRouterFile(process.argv[3], process.argv[4]);
  writeModelFile(process.argv[3], process.argv[4]);
  writeControllerFile(process.argv[3], process.argv[4]);
}
