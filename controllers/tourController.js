const Tour = require('./../models/tourModel');

module.exports = {
  // route param middleware
  checkID: function(req, res, next, paramVal) {
    //if invalid id
    // if(idIsIvalide){
    //   return res.status(500).json({
    //     status : "fail",
    //     data : null
    //   })
    // }
    next();
  },
  getAllTours: async (req, res) => {
    try {
      const tours = await Tour.find();
      res.status(200).json({
        status: 'success',
        //requestedAt: req.requestTime,
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
        message: 'Invalid data error'
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
  }
};
