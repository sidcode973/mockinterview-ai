import { Document, Model, Query } from "mongoose";

type QueryStr = Record<string, string | undefined>;

class APIFilters<T extends Document> {
  query: Query<T[], T>;
  queryStr: QueryStr;

  constructor(model: Model<T>, queryStr: QueryStr) {
    // Wrap the Model into a Query so all chained methods (limit/skip/sort)
    // operate on a Query<T[], T> consistently.
    this.query = model.find();
    this.queryStr = queryStr;
  }

  filter(): this {
    const queryCopy: QueryStr = { ...this.queryStr };

    const removeFields = ["page"];
    removeFields.forEach((el) => delete queryCopy[el]);

    // Mongoose 9.5 doesn't re-export FilterQuery; the find() filter is
    // structurally just a plain object, so cast via Record<string, unknown>.
    this.query = this.query.find(queryCopy as Record<string, unknown>);

    return this;
  }

  pagination(resPerPage: number): this {
    const currentPage = Number(this.queryStr.page) || 1;
    const skip = resPerPage * (currentPage - 1);

    this.query = this.query.limit(resPerPage).skip(skip);
    return this;
  }

  sort(): this {
    this.query = this.query.sort("-createdAt");
    return this;
  }
}

export default APIFilters;
