export const catchAsyncErrors = fn => (req, res, next) =>
  fn(req, res, next).catch(next);

export const convertCase = (input, targetCase) => {
  const toCamelCase = str =>
    str
      .replace(/[-_\s.]+(.)?/g, (_, char) => (char ? char.toUpperCase() : ""))
      .replace(/^(.)/, char => char.toLowerCase());

  const toPascalCase = str =>
    str
      .replace(/[-_\s.]+(.)?/g, (_, char) => (char ? char.toUpperCase() : ""))
      .replace(/^(.)/, char => char.toUpperCase());

  const toSnakeCase = str =>
    str
      .replace(/[-_\s.]+/g, "_")
      .replace(/([a-z])([A-Z])/g, "$1_$2")
      .toLowerCase();

  const toKebabCase = str =>
    str
      .replace(/[-_\s.]+/g, "-")
      .replace(/([a-z])([A-Z])/g, "$1-$2")
      .toLowerCase();

  const toTitleCase = str =>
    str.replace(/[-_\s.]+/g, " ").replace(/\b\w/g, char => char.toUpperCase());

  const normalizedInput = input.replace(/[-_\s.]+/g, " ").toLowerCase();

  switch (targetCase) {
    case "camel":
      return toCamelCase(normalizedInput);
    case "pascal":
      return toPascalCase(normalizedInput);
    case "snake":
      return toSnakeCase(normalizedInput);
    case "kebab":
      return toKebabCase(normalizedInput);
    case "title":
      return toTitleCase(normalizedInput);
    default:
      throw new Error("Unsupported case type");
  }
};
