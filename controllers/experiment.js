const bluebird = require('bluebird');
const crypto = bluebird.promisifyAll(require('crypto'));
const nodemailer = require('nodemailer');
const passport = require('passport');
const User = require('../models/User');
const logger = require('../scripts/logger')

/**
 * GET /login
 * Login page.
 */
exports.getLogin = (req, res) => {
  if (req.user) {
    return res.redirect('/');
  }
  res.render('account/login', {
    title: 'Login'
  });
};

/**
 * POST /login
 * Sign in using email and password.
 */
exports.postLogin = (req, res, next) => {
  // req.assert('email', 'Email is not valid').isEmail();
  req.assert('password', 'Password cannot be blank').notEmpty();
  // req.sanitize('email').normalizeEmail({ gmail_remove_dots: false });

  const errors = req.validationErrors();

  if (errors) {
    req.flash('errors', errors);
    return res.redirect('/login');
  }

  passport.authenticate('local', (err, user, info) => {
    if (err) { return next(err); }
    if (!user) {
      req.flash('errors', info);
      return res.redirect('/login');
    }
    req.logIn(user, (err) => {
      if (err) { return next(err); }
      req.flash('success', { msg: 'Success! You are logged in.' });
      res.redirect('/');
    });
  })(req, res, next);
};

/**
 * GET /reset/:token
 * Reset Password page.
 */
exports.getReset = (req, res, next) => {
  if (req.isAuthenticated()) {
    return res.redirect('/');
  }
  User
    .findOne({ passwordResetToken: req.params.token })
    .where('passwordResetExpires').gt(Date.now())
    .exec((err, user) => {
      if (err) { return next(err); }
      if (!user) {
        req.flash('errors', { msg: 'Password reset token is invalid or has expired.' });
        return res.redirect('/forgot');
      }
      res.render('account/reset', {
        title: 'Password Reset'
      });
    });
};

exports.getSleepDiary = (req, res) => {
  res.render('experiment/sleepDiary', {
    title: 'Sleep Diary'
  })
}
exports.postSleepDiary = (req, res, next) => {
  const answers = [req.body.question1, req.body.question2, req.body.question3]
  logger.forSleepDiary(req.user.username, answers)
  res.redirect('/activityPicker');
}

exports.getActivityPicker = (req, res) => {
  res.render('experiment/activityPicker', {
    title: 'Activity Picker'
  })
}
exports.postActivityPicker = (req, res, next) => {
  logger.forEvent(req.user.username, req.body.question1)
  res.redirect('/game');
}

exports.getGame = (req, res) => {
  const min = Math.ceil(1);
  const max = Math.floor(4);
  const choice = Math.floor(Math.random() * (max - min)) + min; //The maximum is exclusive and the minimum is inclusive
  var instructions = ""
  var game = ""
  switch (choice) {
    case 1:
      instructions = "experiment/GameA-Instructions"
      game = "GameA"
      break
    case 2:
      instructions = "experiment/GameB-Instructions"
      game = "GameB"
      break
    default:
      instructions = "experiment/GameC-Instructions"
      game = "GameC"
      break
  }
  logger.forEvent(req.user.username, game + " Auto Chosen")
  res.render(instructions, {user: req.user});
}
exports.getGameA = (req, res) => {
  res.render('experiment/GameA', {user: req.user})
  logger.forEvent(req.user.username, 'GameA-Loaded')
}
exports.getGameB = (req, res) => {
  res.render('experiment/GameB', {user: req.user})
  logger.forEvent(req.user.username, 'GameB-Loaded')

}
exports.getGameC = (req, res) => {
  res.render('experiment/GameC', {user: req.user})
  logger.forEvent(req.user.username, 'GameC-Loaded')
}
exports.getExperimentFinished = (req, res) => {
  logger.forEvent(req.user.username, "SignOut")
  req.logout();
  res.render('experiment/experimentFinished');
}
