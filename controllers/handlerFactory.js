const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');

/**
 * FACTORY FUNCTIONS : are the functions (ES6+) which return another function / object
 * (i.e, In our case route handler function)
 */

exports.deleteOne = Model =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.findByIdAndDelete(req.params.id);

    if (!doc) {
      return next(new AppError('Document with that ID, Not Found', 404));
    }

    res.status(204).json({
      status: 'success',
      data: null
    });
  });
