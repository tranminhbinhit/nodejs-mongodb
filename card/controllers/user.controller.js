const {
  resultApiCreateUpdate,
  isEmptyObject,
  isEmpty,
  resultApi,
} = require("../../src/utils/utils");
const db = require("../models");
const User = db.user;

//=============================================================== Tạo tài khoản ===============================================================//
exports.createUser = (req, res) => {
  const { email, userName, fullName, password } = req.body;

  // Validate request
  if (!userName || !email || !password) {
    res.status(400).send({ message: "Request is not valid !" });
    return;
  }

  // Save User in the database
  const filter = {
    $or: [
      {
        email,
      },
      {
        userName,
      },
    ],
  };

  const reqUser = {
    email,
    userName,
    fullName,
    password,
    isActive: false,
    isDelete: false,
  };

  const createNewUser = () => {
    User.updateOne(
      filter,
      {
        $setOnInsert: reqUser,
      },
      {
        upsert: true,
      }
    )
      .then((data) => {
        const { upsertedId } = data;
        res.send(
          resultApiCreateUpdate(
            upsertedId,
            isEmpty(upsertedId)
              ? "Tài khoản đã tồn tại"
              : "Thêm tài khoản thành công"
          )
        );
      })
      .catch((err) => {
        res.status(500).send({
          message:
            err.message || "Some error occurred while creating the User.",
        });
      });
  };

  User.find({
    email,
  }).then((data) => {
    if (!isEmptyObject(data)) {
      res.send(resultApiCreateUpdate(0, "Email đã tồn tại"));
    } else {
      createNewUser();
    }
  });
};

//=============================================================== Đăng nhập tài khoản ===============================================================//
exports.loginUser = (req, res) => {
  const { userName, password } = req.body;
  var filter = {
    $or: [
      {
        userName,
      },
      {
        email: userName,
      },
    ],
    password,
  };

  User.findOne(filter)
    .then((data) => {
      res.send(resultApi(data));
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred.",
      });
    });
};

//=============================================================== Xem tài khoản ===============================================================//
exports.getUserInfo = (req, res) => {
  const id = req.params.id;

  User.findById(id)
    .then((data) => {
      if (!data) {
        res
          .status(404)
          .send(resultApi({ message: "Not found with id " + id }));
      } else {
        res.send(resultApi(data));
      }
    })
    .catch((err) => {
      res.status(500).send({ message: "Error retrieving with id=" + id });
    });
};

//=============================================================== Cập nhật tài khoản tài khoản ===============================================================//
exports.updateUserInfo = (req, res) => {
  const { fullName, id, socialLinkObj, linkObj, userInfo } = req.body;

  // Validate request
  if (!id) {
    res.status(400).send({ message: "Request is not valid !" });
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
      res.status(500).send({
        message:
          err.message || "Some error",
      });
    });
};

//=============================================================== Xoá toàn bộ user ===============================================================//
exports.deleteAll = (req, res) => {
  User.deleteMany({})
    .then((data) => {
      res.send({
        message: `${data.deletedCount} Tutorials were deleted successfully!`,
      });
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while removing all tutorials.",
      });
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
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving tutorials.",
      });
    });
};
