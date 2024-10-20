import { BadRequestError } from "../errors/BadRequestError";
import { NotFound } from "../errors/NotFound";
import { DuplicateError } from "../errors/DuplicateError";
import { Default } from "../errors/Default";
import { NotAuthorized } from "../errors/NotAuthorized";
import { ForbiddenError } from "../errors/ForbiddenError";

function handleErrors(err, next) {
  console.error(err);
  if (err.name === "ValidationError" || err.name === "CastError") {
    return next(new BadRequestError("Bad Request"));
  }
  if (err.name === "DocumentNotFoundError") {
    return next(new NotFound("Not Found"));
  }
  if (err.code === 11000) {
    return next(new DuplicateError("Duplicate Error"));
  }
  if (err.statusCode === 401) {
    return next(new NotAuthorized("Not Authorized Error"));
  }
  return next(new Default("Server Error"));
}

export default {
  handleErrors,
  BadRequestError,
  NotFound,
  DuplicateError,
  Default,
  NotAuthorized,
  ForbiddenError,
};
