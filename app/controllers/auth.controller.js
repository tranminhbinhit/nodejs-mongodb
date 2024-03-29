const moment = require("moment/moment");
const config = require("../config/auth.config");
const db = require("../models");
const { user: User, role: Role, refreshToken: RefreshToken } = db;

var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");
const { resultApi, resultApiCreateUpdate } = require("../../src/utils/utils");

exports.signup = (req, res) => {
  const user = new User({
    userName: req.body.userName,
    email: req.body.email,
    password: bcrypt.hashSync(req.body.password, 8),
  });

  user.save((err, user) => {
    if (err) {
      res.status(500).send(resultApiCreateUpdate(-1, err));
      return;
    }
    res.send(resultApiCreateUpdate(1, "Đăng ký tài khoản thành công!"));
  });
};

exports.signin = (req, res) => {
  const { userName, password } = req.body;
  User.findOne({
    $or: [
      {
        userName,
      },
      {
        email: userName,
      },
    ],
  }).exec(async (err, user) => {
    if (err) {
      res.status(500).send(resultApiCreateUpdate(-1, err));
      return;
    }

    if (!user) {
      return res
        .status(404)
        .send(resultApiCreateUpdate(0, "Không tìm thấy tài khoản"));
    }

    var passwordIsValid = bcrypt.compareSync(password, user.password);

    if (!passwordIsValid) {
      return res
        .status(401)
        .send(resultApiCreateUpdate(0, "Mật khẩu không đúng"));
    }

    let token = jwt.sign({ id: user.id }, config.secret, {
      expiresIn: config.jwtExpiration,
    });

    let refreshToken = await RefreshToken.createToken(user);
    const expiredTime = moment().add(config.jwtExpiration, 'seconds');
    res.status(200).send(
      resultApi({
        id: user._id,
        userName: user.userName,
        email: user.email,
        fullName: user.fullName,
        accessToken: token,
        refreshToken: refreshToken,
        expiryTs: expiredTime.unix(),
        expiredTime: expiredTime.format('YYYY-MM-DD HH:mm:ss'),
        refreshExpirationTs: config.jwtRefreshExpiration
      })
    );
  });
};

exports.refreshToken = async (req, res) => {
  const { refreshToken: requestToken } = req.body;

  if (requestToken == null) {
    return res
      .status(403)
      .json(resultApiCreateUpdate(0, "Refesh Token là trường bắt buộc"));
  }

  try {
    let refreshToken = await RefreshToken.findOne({ token: requestToken });

    if (!refreshToken) {
      res
        .status(403)
        .json(
          resultApiCreateUpdate(0, "Không tồn tại refesh token trong hệ thống")
        );
      return;
    }

    if (RefreshToken.verifyExpiration(refreshToken)) {
      RefreshToken.findByIdAndRemove(refreshToken._id, {
        useFindAndModify: false,
      }).exec();

      res
        .status(403)
        .json(
          resultApiCreateUpdate(
            0,
            "Refresh token was expired. Please make a new signin request"
          )
        );
      return;
    }

    let newAccessToken = jwt.sign(
      { id: refreshToken.user._id },
      config.secret,
      {
        expiresIn: config.jwtExpiration,
      }
    );

    const expiredTime = moment().add(config.jwtExpiration, 'seconds');
    return res.status(200).json(
      resultApi({
        accessToken: newAccessToken,
        refreshToken: refreshToken.token,
        expiryTs: expiredTime.unix(),
        expiredTime: expiredTime.format('YYYY-MM-DD HH:mm:ss'),
        refreshExpirationTs: config.jwtRefreshExpiration
      })
    );
  } catch (err) {
    return res.status(500).send(resultApiCreateUpdate(-1, err));
  }
};


exports.signinSocial = (req, res) => {
  const { id, email, image, name, provider } = req.body;
  User.findOne({
    email: email,
    // $or: [
    //   {
    //     id: id,
    //   },
    //   {
    //     email: email,
    //   },
    // ],
  }).exec(async (err, user) => {
    if (err) {
      res.status(500).send(resultApiCreateUpdate(-1, err));
      return;
    }

    const siginRes = async (userAuth) => {
      let token = jwt.sign({ id: userAuth.id }, config.secret, {
        expiresIn: config.jwtExpiration,
      });
  
      let refreshToken = await RefreshToken.createToken(userAuth);
      const expiredTime = moment().add(config.jwtExpiration, 'seconds');
      res.status(200).send(
        resultApi({
          id: userAuth._id,
          userName: userAuth.userName,
          email: userAuth.email,
          fullName: userAuth.fullName,
          accessToken: token,
          refreshToken: refreshToken,
          expiryTs: expiredTime.unix(),
          expiredTime: expiredTime.format('YYYY-MM-DD HH:mm:ss'),
          refreshExpirationTs: config.jwtRefreshExpiration
        })
      );
    }

    if (!user) {
      //Create user
      const userCreate = new User({
        userName: `${email}_${id}`,
        email,
        fullName: name,
        password: '',
        socialAuthen : {
          [provider]: {
            id,
            email
          }
        }
      });
    
      userCreate.save((err, userCreate) => {
        if (err) {
          res.status(500).send(resultApiCreateUpdate(-1, err));
          return;
        }
        //user = userCreate;
        siginRes(userCreate);
      });
    } else {
      //update User login Social
      const socialAuthen = {
        ...(user.socialAuthen || {}),
        [provider]: {
          id,
          email
        }
      }
      
      const reqUpdate = {
        socialAuthen,
      }
      
      User.updateOne(
        {
          _id: user.id ?? new mongoose.Types.ObjectId(),
        },
        reqUpdate
      )
      .then((data) => {
        siginRes(user);
      })
      .catch((err) => {
        res.status(500).send(resultApiCreateUpdate(-1, err));
      });
    }

  });
};
