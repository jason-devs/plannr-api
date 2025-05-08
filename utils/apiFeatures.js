const attachOperator = (key, query) => {
  const splitQuery = query.split(",");

  if (splitQuery.length === 1) return { [key]: query };

  const queryBody =
    splitQuery.length > 2 ? splitQuery.slice(1) : splitQuery.slice(1).join("");

  switch (splitQuery[0]) {
    case "all":
      return { [key]: { $all: queryBody } };
    case "in":
      return { [key]: { $in: queryBody } };
    default:
      return { [key]: queryBody };
  }
};

class APIFeatures {
  constructor(query, queryString, method = "find") {
    this.query = query;
    this.queryString = queryString;
    this.method = method;
  }

  filter() {
    //NOTE: Copies incoming req.query object:
    const queryObj = { ...this.queryString };

    //NOTE: Clears the following reserved fields for sorting, pagination ETC:
    const reservedFields = ["pageNumber", "sort", "limit", "fields"];

    reservedFields.forEach(field => delete queryObj[field]);

    //NOTE: Formats the operator for Mongo $ syntax:
    this.fields = Object.keys(queryObj).reduce((acc, key) => {
      acc = { ...acc, ...attachOperator(key, queryObj[key]) };
      return acc;
    }, {});

    //NOTE: Calls find on the query object:
    this.query = this.query[this.method](this.fields, {});

    //NOTE: Makes the method chain-able:
    return this;
  }

  sort() {
    //NOTE: Destructures and sets default:
    const { sort = "-createdAt" } = this.queryString;

    //NOTE: If user sets sort property this will parse and call the relevant Mongoose method:
    if (sort !== "-createdAt") {
      const queryFields = sort.split(",").join(" ");
      this.query = this.query.sort(queryFields);
    }

    //NOTE: Makes the method chain-able:
    return this;
  }

  limitFields() {
    //NOTE: Destructures and sets default:
    const { fields = "-__v" } = this.queryString;

    //NOTE: If user sets fields property this will parse and call the relevant Mongoose method:
    if (fields !== "-__v") {
      const queryFields = fields.split(",").join(" ");
      this.query = this.query.select(queryFields);
    }

    //NOTE: Makes the method chain-able:
    return this;
  }

  paginate() {
    //NOTE: Destructures and sets default:
    const { pageNumber = "1", limit = "100" } = this.queryString;

    //NOTE: Calculates how many results to skip based on page #
    const skip = (+pageNumber - 1) * limit;

    //NOTE: Calls the relevant Mongoose methods:
    this.query = this.query.skip(skip).limit(limit);

    //NOTE: Makes the method chain-able:
    return this;
  }
}

export default APIFeatures;
