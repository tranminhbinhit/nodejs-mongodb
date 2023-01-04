const {
  resultApiCreateUpdate,
  resultApi,
  isEmptyObject,
} = require("../../src/utils/utils");
const db = require("../models");
const SettingSystem = db.settingSystem;

// exports.getUserInfoByUser = (req, res) => {
//   const userName = req.params.userName;
//   User.find({userName})
//     .then((data) => {
//       if (!data) {
//         res
//           .status(404)
//           .send(resultApiCreateUpdate(0 , 'Request is not valid !'));
//       } else {
//         res.send(resultApi(data));
//       }
//     })
//     .catch((err) => {
//       res.status(500).send(resultApiCreateUpdate(-1, err));
//     });
// };

//=============================================================== Cập nhật tài khoản tài khoản ===============================================================//
// exports.updateUserInfo = (req, res) => {
//   const id = req.userId;
//   const { fullName, socialLinkObj, linkObj, userInfo } = req.body;

//   // Validate request
//   if (!id) {
//     res.status(400).send(resultApiCreateUpdate(0 , 'Request is not valid !'));
//     return;
//   }

//   const reqUser = {
//     fullName, socialLinkObj, linkObj, userInfo
//   };

//   User.findOneAndUpdate(
//     {
//       _id: id ?? new mongoose.Types.ObjectId(),
//     },
//     reqUser
//   )
//     .then((data) => {
//       const { id } = data;
//       res.send(
//         resultApiCreateUpdate(
//           id
//         )
//       );
//     })
//     .catch((err) => {
//       res.status(500).send(resultApiCreateUpdate(-1, err));
//     });
// };

exports.createSetting = (req, res) => {
  const {
    settingTypeId,
    settingCode,
    settingName,
    settingValue,
    settingType,
    sort,
    isEdit = true,
    isShow = true,
    isActive = true,
    isDelete = false,
  } = req.body;
  const reqData = {
    settingTypeId,
    settingCode,
    settingName,
    settingValue,
    settingType,
    sort,
    isEdit,
    isShow,
    isActive,
    isDelete,
  }
  const setting = new SettingSystem(reqData);

  SettingSystem.find({
    settingCode,
  }).then((data) => {
    if (!isEmptyObject(data)) {
      //Cap nhat
      SettingSystem.findOneAndUpdate(
        {
          settingCode,
        },
        reqData
      )
        .then((data) => {
          const { id } = data;
          res.send(resultApiCreateUpdate(1, "Cập nhật cấu hình thành công!"));
        })
        .catch((err) => {
          res.status(500).send(resultApiCreateUpdate(-1, err));
        });
    } else {
      //Tao moi
      setting.save((err, user) => {
        if (err) {
          res.status(500).send(resultApiCreateUpdate(-1, err));
          return;
        }
        res.send(resultApiCreateUpdate(1, "Tạo cấu hình thành công!"));
      });
    }
  });
};

//=============================================================== Xem toàn bộ user ===============================================================//
exports.findAll = (req, res) => {
  const title = req.query.title;
  var condition = {};
  SettingSystem.find(condition)
    .then((data) => {
      res.send(resultApi(data));
    })
    .catch((err) => {
      res.status(500).send(resultApiCreateUpdate(-1, err));
    });
};
