const errorHandler = (error, request, response, next) => {
  if (error.name === "CastError") {
    return response.status(400).json({ error: "malformatted id" });
  }

  if (error.name === "ValidationError") {
    return response.status(400).json({ error: error.message });
  }

  if (error.code === 11000) {
    return response.status(400).json({ error: "name must be unique" });
  }

  if (error.status) {
    return response.status(error.status).json({ error: error.message });
  }

  next(error);
};

module.exports = errorHandler;