import express from 'express';
import User from '../models/Users';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import config from '../core/config/config.dev';
import verifyToken from '../modules/verifyToken';
import verifyTokenAdmin from '../modules/verifyTokenAdmin';
import { AddUserValidation, LoginValidation } from '../models/Validations';

const router = express.Router();

const userObj = user => {
  return {
    userid: user.userid,
    star_name_wishlist: user.star_name_wishlist,
    fanclubs: user.fanclubs,
    friends: user.friends,
    hr_member_flag: user.hr_member_flag,
    birth_day: user.birth_day,
    country_code: user.country_code,
    user_photo: user.user_photo,
    user_nickname: user.user_nickname,
    user_email: user.user_email,
    created_date: user.created_date,
    phone_number: user.phone_number,
    status_msg: user.status_msg,
    fav_friends: user.fav_friends,
    waiting_fanclubs: user.waiting_fanclubs
  };
};

// 회원 등록(앱)
router.post('/register', async (req, res) => {
  const { error } = AddUserValidation(req.body);
  if (error) return res.json({ error: error.details[0].message });

  const userIdExist = await User.findOne({ userid: req.body.userid });
  if (userIdExist) return res.json({ error: 'The user ID is already taken.' });

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(req.body.password, salt);

  const user = new User({
    userid: req.body.userid,
    password: hashedPassword,
    created_date: parseInt(Date.now())
  });

  try {
    const savedUser = await user.save();
    res.json({
      success: 'true'
    });
  } catch (err) {
    res.status(400).send(err);
  }
});

// 회원 등록 함수(관리자))
const registerMember = async (req, res) => {
  // const { error } = AddUserValidation(req.body);
  // if (error) return res.json({ error: error.details[0].message });

  const userIdExist = await User.findOne({ userid: req.body.userid });
  if (userIdExist) return res.json({ error: 'The user ID is already taken.' });

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(req.body.password, salt);

  const user = new User({
    userid: req.body.userid,
    password: hashedPassword,
    created_date: parseInt(Date.now()),
    user_nickname: req.body.user_nickname,
    birth_day: req.body.birth_day || '',
    phone_number: req.body.phone_number || '',
    user_email: req.body.user_email || '',
    user_photo: req.body.user_photo
  });

  try {
    const savedUser = await user.save();

    console.log(savedUser);

    if (savedUser) {
      res.json({
        success: 'true'
      });
    } else {
      res.status(400).json({ error: '에러가 발생했습니다.' });
    }
  } catch (err) {
    res.status(400).send(err);
  }
};

// 회원 등록(관리자)
router.post('/register-admin', verifyTokenAdmin, registerMember);

// 소셜 로그인
router.post('/simple-login', async (req, res) => {
  // userid, social_site
  try {
    const user = await User.findOne({ userid: req.body.userid });
    if (!user) {
      // 회원가입 시킴
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(req.body.userid + 'social-login', salt);

      const user = new User({
        userid: req.body.userid,
        password: hashedPassword,
        social_flag: true,
        social_site: req.body.social_site,
        created_date: parseInt(Date.now())
      });

      const savedUser = await user.save();
      res.json({
        success: 'true'
      });
    } else {
      if (user.social_flag) {
        // Create and assign a token
        const token = jwt.sign({ _id: user._id }, config.TOKEN_SECRET);
        res.header('Auth-Token', token).json({ success: 'true', token: token });
      } else {
        res.json({ error: 'The social ID is not confirmed for normal login' });
      }
    }
  } catch (err) {
    res.status(400).send(err);
  }
});

// 로그인
router.post('/login', async (req, res) => {
  try {
    const { error } = LoginValidation(req.body);
    if (error) return res.json({ error: error.details[0].message });

    const user = await User.findOne({ userid: req.body.userid });
    if (!user) return res.json({ error: '잘못된 아이디입니다.' });

    const validPassword = await bcrypt.compare(req.body.password, user.password);
    if (!validPassword) return res.json({ error: '패스워드가 잘못 되었습니다.' });

    if (user.social_flag) {
      res.json({ error: 'The social ID is not confirmed for normal login.' });
    } else {
      // Create and assign a token
      const token = jwt.sign({ _id: user._id }, config.TOKEN_SECRET);
      res.header('Auth-Token', token).json({ success: 'true', token: token });
    }
  } catch (err) {
    res.status(400).res.send(err);
  }
});

// 회원 찾기
router.get('/find', verifyToken, (req, res) => {
  const _id = req.query._id,
    userid = req.query.userid,
    userids = req.query.userids;

  try {
    const query = {};

    if (_id != undefined) query._id = _id;
    if (userid != undefined) query.userid = userid;
    if (userids != undefined) {
      const arr = userids.split(',');
      query.userid = { $in: arr };
    }

    if (userids != undefined) {
      const userInfo = User.find(query)
        .sort({ created_date: -1 })
        .exec(async (err, user) => {
          if (err) {
            res.status(400).send(err);
          } else {
            let arr = [];
            const users = await user.map(async item => {
              arr.push(userObj(item));
            });
            res.json(arr);
          }
        });
    } else {
      const userInfo = User.findOne(query, async (err, user) => {
        if (err) {
          res.status(400).send(err);
        } else {
          res.json(userObj(user));
        }
      });
    }
  } catch (err) {
    res.status(400).send(err);
  }
});

// 회원 클럽 가입 업데이트
router.post('/regitsterclub', verifyToken, async (req, res) => {
  let clubObj = {
    fc_code: req.body.code,
    fc_member_level: req.body.member_level,
    fc_joining_date: parseInt(Date.now()),
    fc_joining_status: 'running',
    fc_withdrawal_date: null,
    fc_pause_date: null,
    fc_rejoin_date: null
  };

  const userid = req.body.userid;

  const userExist = await User.findOne({ userid: userid });
  if (!userExist) return res.status(400).json({ error: 'The user is not exist.' });

  try {
    const oneUser = User.findOneAndUpdate({ userid: userid }, { $push: { fanclubs: clubObj } }, (err, item) => {
      console.log(err);
      if (err) {
        res.status(400).json(err);
      } else {
        res.json(userObj(item));
      }
    });
  } catch (err) {
    console.log('err : ', err);
    res.status(400).json(err);
  }
});

// 회원정보 수정
const modifyMember = async (req, res) => {
  const userid = req.body.userid,
    password = req.body.password,
    user_nickname = req.body.user_nickname || '',
    phone_number = req.body.phone_number || '',
    user_photo = req.body.user_photo || '',
    user_email = req.body.user_email || '',
    birth_day = req.body.birth_day || '';

  const userExist = await User.findOne({ userid: userid });
  if (!userExist) return res.status(400).json({ error: '해당 유저가 존재하지 않습니다.' });

  try {
    let obj = {
      user_nickname: user_nickname,
      phone_number: phone_number,
      user_photo: user_photo,
      user_email: user_email,
      birth_day: birth_day
    };

    if (password != undefined) {
      console.log('password : ', password);
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
      obj.password = hashedPassword;
    }

    console.log(obj);

    const oneUser = User.findOneAndUpdate(
      { userid: userid },
      {
        $set: obj
      },
      (err, item) => {
        if (err) {
          res.status(400).json(err);
        } else {
          res.json(userObj(item));
        }
      }
    );
  } catch (err) {
    console.log('err : ', err);
    res.status(400).json(err);
  }
};

// 회원 정보 수정(비번, 닉네임, 폰넘버, 사진, 생일)
router.post('/modify', verifyToken, modifyMember);
router.post('/modify-admin', verifyTokenAdmin, modifyMember);

// 유저 삭제
router.post('/delete-admin', verifyTokenAdmin, async (req, res) => {
  const userid = req.body.userid;

  try {
    const user = User.findOneAndRemove({ userid: userid }, (err, item) => {
      if (err) {
        res.status(400).send(err);
      } else {
        res.json(userObj(item));
      }
    });
  } catch (err) {
    res.status(400).send(err);
  }
});

// 푸시 토큰 저장
router.post('/save-pushtoken', verifyToken, async (req, res) => {
  const userid = req.body.userid,
    android_token = req.body.android_token,
    ios_token = req.body.ios_token;

  const userIdExist = await User.findOne({ userid: req.body.userid });
  if (!userIdExist) return res.status(400).json({ error: '존재하지 않는 유저입니다.' });

  try {
    let obj = {};

    if (android_token != undefined) obj.fb_android_token = android_token;
    if (ios_token != undefined) obj.fb_ios_token = ios_token;

    console.log(obj);

    const oneUser = User.findOneAndUpdate(
      { userid: userid },
      {
        $set: obj
      },
      (err, item) => {
        if (err) {
          res.status(400).json(err);
        } else {
          res.json({
            userid: item.userid,
            fb_android_token: item.fb_android_token,
            fb_ios_token: item.fb_ios_token
          });
        }
      }
    );
  } catch (err) {
    res.status(400).json({ error: err });
  }
});

export default router;
