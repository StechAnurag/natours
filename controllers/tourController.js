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
  getAllTours: function(req, res) {
    res.status(200).json({
      status: 'success',
      requestedAt: req.requestTime,
      results: 4,
      data: {
        data: 'ALL DATA'
      }
    });
  },

  getTour: function(req, res) {
    const id = req.params.id * 1;
    res.status(200).json({
      status: 'success',
      data: {
        data: id
      }
    });
  },

  createTour: function(req, res) {
    // const newId = tours[tours.length - 1].id + 1;
    // const newTour = Object.assign({ id: newId }, req.body);
    //tours.push(newTour);
    res.status(201).json({
      status: 'success',
      data: {
        tour: 'newTour'
      }
    });
  },

  updateTour: function(req, res) {
    res.status(200).json({
      status: 'success',
      data: {
        tour: '<Updated tour here...>'
      }
    });
  },

  deleteTour: function(req, res) {
    res.status(200).json({
      status: 'success',
      data: null
    });
  }
};
