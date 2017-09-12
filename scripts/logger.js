var exports = module.exports = {}

var mongo = require('mongodb').MongoClient
var moment = require('moment')
var assert = require('assert');


var now = moment()
var timeStamp = {
  "yearLog": now.format('YYYY'),
  "monthLog": now.format('MM'),
  "dateLog": now.format('DD'),
  "timeLog": now.format('HH:mm:ss'),
  "timezoneLog": now.format('Z')
}

var url = process.env.MONGODB_URI || process.env.MONGOLAB_URI;


exports.forEvent = function(username, eventID) {
  var record = {
    "username": username,
    "event": eventID,
    "year": timeStamp.yearLog,
    "month": timeStamp.monthLog,
    "date": timeStamp.dateLog,
    "time": timeStamp.timeLog,
    "timezone": timeStamp.timezoneLog
  }
  mongo.connect(url, function(err, db) {
    assert.equal(null, err);
    db.collection('eventTable').insertOne(record, function(err, result) {
      assert.equal(null, err);
      console.log('Last record inserted: eventID' + eventID + ', username: ' + username);
      db.close();
    });
  })
}

exports.forSleepDiary = function(username, answers) {
  var record = {
    "username": username,
    "year": timeStamp.yearLog,
    "month": timeStamp.monthLog,
    "date": timeStamp.dateLog,
    "time": timeStamp.timeLog,
    "timezone": timeStamp.timezoneLog,
    "Q1": answers[0],
    "Q2": answers[1],
    "Q3": answers[2]
  }
  mongo.connect(url, function(err, db) {
    assert.equal(null, err);
    db.collection('sleepDiaryTable').insertOne(record, function(err, result) {
      assert.equal(null, err);
      console.log('Last sleepDiaryLog for ' + username);
      db.close();
    });
  })
}
