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
  getAllUsers: function(req, res) {
    res.status(200).json({
      status: 'success',
      requestedAt: req.requestTime,
      results: 4,
      data: {
        data: 'ALL USERS'
      }
    });
  },

  getUser: function(req, res) {
    const id = req.params.id * 1;
    res.status(200).json({
      status: 'success',
      data: {
        data: id
      }
    });
  },

  createUser: function(req, res) {
    // const newId = Users[Users.length - 1].id + 1;
    // const newUser = Object.assign({ id: newId }, req.body);
    //Users.push(newUser);
    res.status(201).json({
      status: 'success',
      data: {
        user: 'newUser'
      }
    });
  },

  updateUser: function(req, res) {
    res.status(200).json({
      status: 'success',
      data: {
        user: '<Updated User here...>'
      }
    });
  },

  deleteUser: function(req, res) {
    res.status(200).json({
      status: 'success',
      data: null
    });
  }
};