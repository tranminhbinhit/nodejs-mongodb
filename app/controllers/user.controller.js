const {
  resultApiCreateUpdate,
  resultApi,
} = require("../../src/utils/utils");
const db = require("../models");
const User = db.user;


//=============================================================== Xem tài khoản ===============================================================//
exports.getUserInfo = (req, res) => {
  const id = req.userId;
  User.findById(id)
    .then((data) => {
      if (!data) {
        res
          .status(404)
          .send(resultApiCreateUpdate(0 , 'Request is not valid !'));
      } else {
        res.send(resultApi(data));
      }
    })
    .catch((err) => {
      res.status(500).send(resultApiCreateUpdate(-1, err));
    });
};

exports.getUserInfoByUser = (req, res) => {
  const userName = req.params.userName;
  User.find({userName})
    .then((data) => {
      if (!data) {
        res
          .status(404)
          .send(resultApiCreateUpdate(0 , 'Request is not valid !'));
      } else {
        res.send(resultApi(data));
      }
    })
    .catch((err) => {
      res.status(500).send(resultApiCreateUpdate(-1, err));
    });
};

//=============================================================== Cập nhật tài khoản tài khoản ===============================================================//
exports.updateUserInfo = (req, res) => {
  const id = req.userId;
  const { fullName, socialLinkObj, linkObj, userInfo } = req.body;

  // Validate request
  if (!id) {
    res.status(400).send(resultApiCreateUpdate(0 , 'Request is not valid !'));
    return;
  }

  const reqUser = {
    fullName, socialLinkObj, linkObj, userInfo
  };

  User.findOneAndUpdate(
    {
      _id: id ?? new mongoose.Types.ObjectId(),
    },
    reqUser
  )
    .then((data) => {
      const { id } = data;
      res.send(
        resultApiCreateUpdate(
          id
        )
      );
    })
    .catch((err) => {
      res.status(500).send(resultApiCreateUpdate(-1, err));
    });
};

//=============================================================== Xem toàn bộ user ===============================================================//
exports.findAll = (req, res) => {
  const title = req.query.title;
  var condition = title
    ? { title: { $regex: new RegExp(title), $options: "i" } }
    : {};

  User.find(condition)
    .then((data) => {
      res.send(resultApi(data));
    })
    .catch((err) => {
      res.status(500).send(resultApiCreateUpdate(-1, err));
    });
};
