const Tour = require('./../models/tourModel');
const APIFeatures = require('./../utils/apiFeatures');

module.exports = {
  aliasTopTours: (req, res, next) => {
    req.query.limit = 5;
    req.query.sort = '-ratingsAverage price';
    req.query.fields = 'name,price,ratingsAverage,summary,diffuculty';
    next();
  },

  getAllTours: async (req, res) => {
    try {
      const features = new APIFeatures(Tour.find(), req.query)
        .filter()
        .sort()
        .limitFields()
        .paginate();
      const tours = await features.query;

      res.status(200).json({
        status: 'success',
        results: tours.length,
        data: {
          tours
        }
      });
    } catch (error) {
      console.log(error);
      res.status(400).json({
        status: 'fail',
        message: error
      });
    }
  },

  getTour: async (req, res) => {
    try {
      const tour = await Tour.findById(req.params.id);
      // Tour.findOne({ _id : req.params.id})
      res.status(200).json({
        status: 'success',
        data: {
          data: tour
        }
      });
    } catch (error) {
      console.log(error);
      res.status(400).json({
        status: 'fail',
        message: error
      });
    }
  },

  createTour: async (req, res) => {
    try {
      // const newTour = new Tour({});
      // newTour.save();

      const newTour = await Tour.create(req.body);
      res.status(201).json({
        status: 'success',
        data: {
          tour: newTour
        }
      });
    } catch (error) {
      console.log(error);
      res.status(400).json({
        status: 'fail',
        message: error
      });
    }
  },

  updateTour: async (req, res) => {
    try {
      const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
      });
      res.status(200).json({
        status: 'success',
        data: {
          tour
        }
      });
    } catch (error) {
      console.log(error);
      res.status(400).json({
        status: 'fail',
        message: error
      });
    }
  },

  deleteTour: async (req, res) => {
    try {
      await Tour.findByIdAndDelete(req.params.id);
      res.status(204).json({
        status: 'success',
        data: null
      });
    } catch (error) {
      console.log(error);
      res.status(400).json({
        status: 'fail',
        message: error
      });
    }
  },

  getTourStats: async (req, res) => {
    try {
      const stats = await Tour.aggregate([
        {
          $match: { ratingsAverage: { $gte: 4.5 } }
        },
        {
          $group: {
            //_id: null,
            //_id: '$difficulty',
            _id: { $toUpper: '$difficulty' },
            numTours: { $sum: 1 },
            numRatings: { $sum: '$ratingsQuantity' },
            avgRating: { $avg: '$ratingsAverage' },
            avgPrice: { $avg: '$price' },
            minPrice: { $min: '$price' },
            maxPrice: { $max: '$price' }
          }
        },
        {
          $sort: { avgPrice: 1 }
        }
        // {
        //   $match: { _id: { $ne: 'EASY' } }
        // }
      ]);

      res.status(200).json({
        status: 'success',
        data: stats
      });
    } catch (error) {
      console.log(error);
      res.status(400).json({
        status: 'fail',
        message: error
      });
    }
  },

  getMonthlyPlan: async (req, res) => {
    try {
      const year = req.params.year;

      const plan = await Tour.aggregate([
        {
          $unwind: '$startDates'
        },
        {
          $match: {
            startDates: {
              $gte: new Date(`${year}-01-01`),
              $lte: new Date(`${year}-12-31`)
            }
          }
        },
        {
          $group: {
            _id: { $month: '$startDates' },
            numOfTourStarts: { $sum: 1 },
            tours: { $push: '$name' }
          }
        },
        {
          $addFields: { month: '$_id' }
        },
        {
          $project: {
            _id: 0
          }
        },
        {
          $sort: { numOfTourStarts: -1 }
        },
        {
          $limit: 12
        }
      ]);

      res.status(200).json({
        status: 'success',
        data: plan
      });
    } catch (error) {
      console.log(error);
      res.status(400).json({
        status: 'fail',
        message: error
      });
    }
  }
};
