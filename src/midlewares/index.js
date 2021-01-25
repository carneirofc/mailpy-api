const routeNotFound = (req, res) => {
  res.status(404).json({
    someBody: "Route not found or missing resource...",
  });
};

const exceptionHappened = (error, req, res, next) => {
  if (error.status) {
    res.status(error.status);
  } else {
    res.status(500);
  }
  res.json({
    message: error.message,
    stack: process.env.NODE_ENV === "production" ? "Something wrong happened" : error.stack,
  });
};
export default { routeNotFound, exceptionHappened };
