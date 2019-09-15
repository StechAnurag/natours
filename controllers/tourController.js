const Tour = require('./../models/tourModel');

class APIFeatures {
  constructor(query, queryString) {
    this.query = query;
    this.queryString = queryString;
  }

  filter() {
    const queryObj = { ...this.queryString };
    const excludedFields = ['page', 'sort', 'limit', 'fields'];
    excludedFields.forEach(el => delete queryObj[el]);

    // 1b) Advanced Filtering
    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gte|lte|gt|lt)\b/g, match => `$${match}`);

    this.query = this.query.find(JSON.parse(queryStr));
    return this;
  }

  sort() {
    if (this.queryString.sort) {
      const sortBy = this.queryString.sort.split(',').join(' ');
      this.query = this.query.sort(sortBy);
      // sort('-price ratingsAverage')
    } else {
      // default sort
      this.query = this.query.sort('-createdAt');
    }
    return this;
  }

  limitFields() {
    if (this.queryString.fields) {
      const fields = this.queryString.fields.split(',').join(' ');
      this.query = this.query.select(fields);
    } else {
      this.query = this.query.select('-__v');
    }
    return this;
  }

  paginate() {
    const page = this.queryString.page * 1 || 1;
    const limit = this.queryString.limit * 1 || 100;
    const skip = (page - 1) * limit;

    this.query = this.query.skip(skip).limit(limit);
    return this;
  }
}

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

  aliasTopTours: (req, res, next) => {
    req.query.limit = 5;
    req.query.sort = '-ratingsAverage price';
    req.query.fields = 'name,price,ratingsAverage,summary,diffuculty';
    next();
  },

  getAllTours: async (req, res) => {
    try {
      //const tours = await Tour.find();
      // ANOTHER WAY OF QUERYING DATA using speical mongoose methods
      // const query = Tour.find()
      //   .where('duration')
      //   .equals(5)
      //   .where('difficulty')
      //   .equals('easy');

      // BUILDING THE QUERY
      // 1a) Filtering
      // const queryObj = { ...req.query };
      // const excludedFields = ['page', 'sort', 'limit', 'fields'];
      // excludedFields.forEach(el => delete queryObj[el]);

      // // 1b) Advanced Filtering
      // let queryStr = JSON.stringify(queryObj);
      // queryStr = queryStr.replace(/\b(gte|lte|gt|lt)\b/g, match => `$${match}`);

      // let query = Tour.find(JSON.parse(queryStr));

      // 2) Sorting
      // if (req.query.sort) {
      //   const sortBy = req.query.sort.split(',').join(' ');
      //   query = query.sort(sortBy);
      //   // sort('-price ratingsAverage')
      // } else {
      //   // default sort
      //   query = query.sort('-createdAt');
      // }

      // 3) Field Limiting (Projecting=Selecting only specific fields)
      // if (req.query.fields) {
      //   const fields = req.query.fields.split(',').join(' ');
      //   query = query.select(fields);
      // } else {
      //   query = query.select('-__v');
      // }

      // 4) pagination
      // const page = req.query.page * 1 || 1;
      // const limit = req.query.limit * 1 || 100;
      // const skip = (page - 1) * limit;

      // // page=3&limit=10, 1-10 on page 1, 11-20 on page 2, 21-30 on page 3
      // query = query.skip(skip).limit(limit);

      // //check if the page doesnot exists : skip > numOfDocs
      // if (req.query.page) {
      //   const numOfDocs = await Tour.countDocuments();
      //   if (skip >= numOfDocs) throw new Error('This page does not exists');
      // }

      // EXECUTING THE QUERY
      // query = query.sort().select().skip().limit()
      const features = new APIFeatures(Tour.find(), req.query)
        .filter()
        .sort()
        .limitFields()
        .paginate();
      const tours = await features.query;

      // SENDING THE RESPONSE
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
