import express from 'express';
import User from '../models/Users';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import verifyToken from '../modules/verifyToken';
import config from '../config.dev';

const router = express.Router();

/**
 * 회원 등록
 * @param {string}
 * @return none
 */
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

/**
 * 로그인
 * @param {string}
 * @return none
 */
router.post('/login', async (req, res) => {
  try {
    const { error } = LoginValidation(req.body);
    if (error) return res.json({ error: error.details[0].message });

    const user = await User.findOne({ userid: req.body.userid });
    if (!user) return res.json({ error: '잘못된 아이디입니다.' });

    const validPassword = await bcrypt.compare(req.body.password, user.password);
    if (!validPassword) return res.json({ error: '패스워드가 잘못 되었습니다.' });

    // Create and assign a token
    const token = jwt.sign({ _id: user._id }, config.TOKEN_SECRET);
    res.header('Auth-Token', token).json({ success: 'true', token: token });
  } catch (err) {
    res.status(400).res.send(err);
  }
});

/**
 * 회원 찾기
 * @param {string}
 * @return none
 */
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

export default router;
