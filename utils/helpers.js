// eslint-disable-next-line import/prefer-default-export
export const catchAsyncErrors = fn => (req, res, next) =>
  fn(req, res, next).catch(next);
