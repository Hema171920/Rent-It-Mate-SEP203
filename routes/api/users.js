const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('config');
const { check } = require('express-validator');
//Import packages to send emails
const nodemailer = require('nodemailer');
const sendgridTransport = require('nodemailer-sendgrid-transport');
//Import user model
const Users = require('../../models/Users');
const auth = require('../../middleware/auth');
const Profile = require('../../models/Profile');
const frontend = process.env.PORT || 3000;
const transporter = nodemailer.createTransport(
  sendgridTransport({
    auth: {
      api_key: config.get('sendGridAPIKey')
    }
  })
);

// @route   GET api/users
// @desc    retrieve all users
// @access  admin
router.get('/', auth, async (req, res) => {
  try {
    const user = await Users.findOne({_id:req.user.id})
    if(user.username == 'admin'){
      const users = await Users.find({role:'user'}).populate('profile',['address'])
      res.json(users);
    }
    else
    {
      return res
      .status(400)
      .json({ msg: 'Access is allowed only to admin' });    }
    
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

//@route delete /api/users/admin/:userId
//@desc Delete user by admin
//@access admin

// router.delete('/admin/:user_id', auth, async(req,res) => {
//   try{
//     const admin = await Users.findOne({_id:req.user.id});
//     if(admin.username === 'admin'){
//       const userProfile = await Profile.findOne({user:req.params.user_id});
//     if(userProfile){
//       console.log('inside profile retrieved')
//         await Profile.deleteOne(userProfile);
//     }
//     const user = await Users.findOne({_id: req.params.user_id});
//     if(user){
//       console.log('inside admin delete user retrieved')
//         await Users.deleteOne(user);
//     }
//     res.json({msg: 'User removed'});

//     }
//     else{
//       return res.json('Only admin is allowed to access this route');
//     }
    
// }
// catch(err){
//   //  console.log(err.message);

// /* istanbul ignore next */
//     res.status(500).send('server error');  
// }  
// });

//@route Post api/users
//@desc Register User
//@access Public

router.post(
  '/',
  [
    check('name', 'Name is required')
      .not()
      .isEmpty(),
    check('email', 'Please include a valid email').isEmail(),
    check(
      'password',
      'Please enter a password with 6 or more characters'
    ).isLength({ min: 6 })
  ],
  async (req, res) => {
    let user, host, link;
    const { name, username, email, password } = req.body;

    try {
      user = await Users.findOne({ email });
      if (user) {
        return res
          .status(400)
          .json({ error: [{ msg: 'Email already exists!' }] });
      } else {
        user = await Users.findOne({ username });
      }

      if (user) {
        return res
          .status(400)
          .json({ error: [{ msg: 'Username already exists!' }] });
      }

      const payload = {
        user: {
          id: name
        }
      };
      user = new Users({
        name: name,
        username: username,
        email: email,
        password: password,
        temporarytoken: jwt.sign(payload, config.get('jwttoken'), {
          expiresIn: 86400 // expires in a day
        })
      });
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);
      const result = await user.save();
      host = req.get('host');
      link =
        'http://' +
        req.get('host') +
        '/api/users/verify?id=' +
        result.temporarytoken;
      const emailObject = {
        from: 'rent-it-mate@node-complete.com',
        to: result.email,
        subject: 'Please verify your account',
        text: `Hello ${result.name}, Please click on the following link`,
        html:
          'Hello,<br> Please Click on the link to verify your email.<br> ' +
          '<a href=' +
          link +
          '>Click here to verify</a>'
      };

      /* istanbul ignore next */
      const sentEmail = transporter.sendMail(emailObject, function(err, info) {
        if (err) {
          console.log(err);
        } else {
          console.log('Verification Link sent -  : ' + info.response);
        }
      });
      res.json({
        success: true,
        message: 'Email sent'
      });
      //res.json(result);
    } catch (err) {
      /* istanbul ignore next */
      console.error(err.message);
    }
  }
);
router.get('/verify', (req, res) => {
  let user;
  Users.findOne({ temporarytoken: req.query.id }, (err, user) => {
    if (err) throw err;
    const token = req.query.id;
    jwt.verify(token, config.get('jwttoken'), (err, decoded) => {
      if (err) {
        res.json({ success: false, message: 'Activation Link is expired' });
      } else if (!user) {
        res.json({ success: false, message: 'Activation Link is expired' });
      } else {
        /* istanbul ignore next */
        user.temporarytoken = false;
        user.verifiedStatus = true;
        user.save(err => {
          if (err) {
            console.log(err);
          } else {
            const emailObject = {
              from: 'rent-it-mate@node-complete.com',
              to: user.email,
              subject: 'Account Activated',
              text: `Hello ${user.name}, Your account has been successfully activated!`,
              html: `Hello<strong> ${user.name}</strong>,<br><br>Your account has been successfully activated!`
            };
            transporter.sendMail(emailObject, function(err, info) {
              /* istanbul ignore next */
              if (err) {
                console.log(err);
              } else {
                // console.log(
                //   'Activation Message Confirmation -  : ' + info.response
                // );
              }
            });
            /* istanbul ignore next */
            if (frontend == 3000) {
              res.redirect('http://localhost:' + frontend + '/login');
            }
            /* istanbul ignore next */
            if (frontend == process.env.PORT) {
              res.redirect(frontend + '/login');
            }
          }
        });
      }
    });
  });
});

module.exports = router;
