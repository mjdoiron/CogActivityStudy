'use strict';
const mongotocsv = require('mongo-to-csv');
const logger = require('../scripts/logger')


exports.index = (req, res) => {
  res.render('home', {
    title: 'Home'
  });
};

exports.getUsersDownload = (req, res) => {
  logger.forEvent(req.user.username, 'DownloadUsersCSV')

  let options = {
      database: 'heroku_7g9qjsr6', // required
      collection: 'users', // required
      fields: ['updatedAt.$date','createdAt.$date','username'], // required
      output: './output/users.csv', // required
  };
  mongotocsv.export(options, function (err, success) {
      if (err) {
        console.log(err);
      }
      if (success) {
        console.log(success);
        var file = __dirname + '/output/users.csv';
        res.download(file); // Set disposition and send it.
      }
  });
}
exports.getSleepDiaryDownload = (req,res) => {
  logger.forEvent(req.user.username, 'DownloadUsersCSV')

  let options = {
      database: 'heroku_7g9qjsr6', // required
      collection: 'sleepDiaryTable', // required
      fields: ["username","year","month","date","time","timezone","Q1","Q2","Q3"], // required
      output: './output/sleepDiaryTable.csv', // required
  };

  mongotocsv.export(options, function (err, success) {
      if (err) {
        console.log(err);
      }
      if (success) {
        console.log(success);
        var file = __dirname + '/output/sleepDiaryTable.csv';
        res.download(file); // Set disposition and send it.
      }
  });
}
exports.getEventLogDownload = (req,res) => {
  logger.forEvent(req.user.username, 'DownloadUsersCSV')

  let options = {
      database: 'heroku_7g9qjsr6', // required
      collection: 'eventTable', // required
      fields: ["username","eventID","year","month","date","time","timezone"], // required
      output: './output/eventTable.csv', // required
  };
  mongotocsv.export(options, function (err, success) {
      if (err) {
        console.log(err);
      }
      if (success) {
        console.log(success);
        var file = __dirname + '/output/eventTable.csv';
        res.download(file); // Set disposition and send it.
      }
  });
}
