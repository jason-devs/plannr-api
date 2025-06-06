/* eslint-disable no-console */
import fs from "fs";
import mongoose from "mongoose";
import dotenv from "dotenv";
import models from "./models/modelRegistry.js";
import teches from "./dev-data/teches.js";
import { convertCase } from "./utils/helpers.js";

const clearResources = async () => {
  try {
    dotenv.config();
    const connectionString = process.env.DATABASE.replace(
      "<PASSWORD>",
      process.env.DB_PASSWORD,
    ).replace("<USERNAME>", process.env.DB_USERNAME);
    await mongoose.connect(connectionString);
    console.log(`Connection successful`);
    await models.UserStory.deleteMany();
    await models.Page.deleteMany();
    await models.BackendResource.deleteMany();
    await models.Project.deleteMany();
    await models.TechStack.deleteMany();
    await models.Tech.deleteMany();
    await models.Role.deleteMany();
    mongoose.disconnect();
  } catch (error) {
    console.log(error);
  }
};

const clearAll = async () => {
  try {
    dotenv.config();
    const connectionString = process.env.DATABASE.replace(
      "<PASSWORD>",
      process.env.DB_PASSWORD,
    ).replace("<USERNAME>", process.env.DB_USERNAME);
    await mongoose.connect(connectionString);
    console.log(`Connection successful`);
    await models.UserStory.deleteMany();
    await models.Page.deleteMany();
    await models.BackendResource.deleteMany();
    await models.Project.deleteMany();
    await models.TechStack.deleteMany();
    await models.Tech.deleteMany();
    await models.Role.deleteMany();
    await models.User.deleteMany();
    mongoose.disconnect();
  } catch (error) {
    console.log(error);
  }
};

const writeRouterFile = function (resourceName, parentResourceName) {
  const routerFile = fs
    .readFileSync("./routers/templateRouter.txt", "utf-8")
    .replaceAll("%%VARIABLENAME%%", convertCase(resourceName, "camel"))
    .replaceAll("%%MODELNAME%%", convertCase(resourceName, "pascal"))
    .replaceAll(
      "%%PARENTVARIABLENAME%%",
      convertCase(parentResourceName, "camel"),
    )
    .replaceAll("%%RESOURCENAME%%", convertCase(resourceName, "kebab"));

  fs.writeFileSync(
    `./routers/${convertCase(resourceName, "camel")}Router.js`,
    routerFile,
  );
};

const writeModelFile = function (resourceName, parentResourceName) {
  const modelFile = fs
    .readFileSync("./models/templateModel.txt", "utf-8")
    .replaceAll("%%VARIABLENAME%%", convertCase(resourceName, "camel"))
    .replaceAll("%%MODELNAME%%", convertCase(resourceName, "pascal"))
    .replaceAll(
      "%%PARENTVARIABLENAME%%",
      convertCase(parentResourceName, "camel"),
    )
    .replaceAll(
      "%%PARENTMODELNAME%%",
      convertCase(parentResourceName, "pascal"),
    )
    .replaceAll("%%MODELNAMESPACE%%", convertCase(resourceName, "title"))
    .replaceAll("%%NAME%%", resourceName)
    .replaceAll("%%PARENTNAME%%", parentResourceName);

  fs.writeFileSync(
    `./models/${convertCase(resourceName, "camel")}Schema.js`,
    modelFile,
  );
};

const writeControllerFile = function (resourceName, parentResourceName) {
  const controllerFile = fs
    .readFileSync("./controllers/templateController.txt", "utf-8")
    .replaceAll("%%VARIABLENAME%%", convertCase(resourceName, "camel"))
    .replaceAll("%%MODELNAME%%", convertCase(resourceName, "pascal"))
    .replaceAll(
      "%%PARENTVARIABLENAME%%",
      convertCase(parentResourceName, "camel"),
    )
    .replaceAll("%%NAME%%", resourceName)
    .replaceAll("%%PARENTNAME%%", parentResourceName);

  fs.writeFileSync(
    `./controllers/${convertCase(resourceName, "camel")}Controller.js`,
    controllerFile,
  );
};

const seedTechData = async () => {
  try {
    const techData = teches.map(tech => ({
      ...tech,
      createdBy: "680f76dcbf62160ef6bab14b",
    }));
    dotenv.config();
    const connectionString = process.env.DATABASE.replace(
      "<PASSWORD>",
      process.env.DB_PASSWORD,
    ).replace("<USERNAME>", process.env.DB_USERNAME);

    await mongoose.connect(connectionString);
    console.log(`Connection successful`);

    // Delete existing tech data first
    await models.Tech.deleteMany();
    console.log("Existing tech data deleted");

    // Insert new tech data
    const techs = await models.Tech.create(techData);
    console.log(`${techs.length} technologies successfully loaded`);

    mongoose.disconnect();
  } catch (error) {
    console.log("Error seeding tech data:", error);
  }
};

if (process.argv[2] === "--clearResources") await clearResources();
if (process.argv[2] === "--clearAll") await clearAll();

if (process.argv[2] === "--writeFiles") {
  writeRouterFile(process.argv[3], process.argv[4]);
  writeModelFile(process.argv[3], process.argv[4]);
  writeControllerFile(process.argv[3], process.argv[4]);
}

if (process.argv[2] === "--seedTech") await seedTechData();
