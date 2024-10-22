import { BadRequestError } from "../utils/errors/BadRequestError";
import { NotFound } from "../utils/errors/NotFound";
import { DuplicateError } from "../utils/errors/DuplicateError";
import { Default } from "../utils/errors/Default";
import { NotAuthorized } from "../utils/errors/NotAuthorized";
import { ForbiddenError } from "../utils/errors/ForbiddenError";

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
  BAD_REQUEST: 400,
  FORBIDDEN_ERROR: 403,
  NOT_FOUND: 404,
  DEFAULT: 500,
  NOT_AUTHORIZED: 401,
  OKAY_REQUEST: 200,
  CREATE_REQUEST: 201,
  DUPLICATE_ERROR: 409,
};
