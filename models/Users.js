import mongoose from 'mongoose';

const Schema = mongoose.Schema;

// define User Schema
const UserSchema = new Schema({
  userid: { type: String, required: true },
  password: { type: String, required: true },
  phone_number: { type: String, required: false, default: '' },
  created_date: { type: String, required: false, default: '' },
  social_flag: { type: Boolean, required: false }, // 소셜 로그인 여부
  social_site: { type: String, required: false }, // 소셜 로그인한 사이트
  status_msg: { type: String, required: false, default: '' },
  user_email: { type: String, required: false, default: '' },
  user_nickname: { type: String, required: false, default: '' },
  user_photo: { type: String, required: false, default: '' },
  country_code: { type: String, required: false, default: '' },
  birth_day: { type: String, required: false, default: '' },
  hr_member_flag: { type: String, required: false, default: 'false' },
  friends: { type: Array, required: false },
  fav_friends: { type: Array, required: false },
  fanclubs: { type: Array, required: false },
  waiting_fanclubs: { type: Array, required: false },
  star_name_wishlist: { type: Array, required: false },
  fb_android_token: { type: Object, required: false, default: '' }, // 푸시토큰 안드로이드
  fb_ios_token: { type: Object, required: false, default: '' } // 푸시토큰 안드로이드
});

export default mongoose.model('User', UserSchema);
