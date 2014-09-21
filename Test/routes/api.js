var express = require('express');
var api = express.Router();
var rest = require('restler');
var qs = require('querystring');
var Uber = require('uber-api')(process.env.UBER_TOKEN,'v1');

api.all('*', function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "X-Requested-With");
  next();
 });
/* GET home page. */
var Doctor = function(elem) {
    this.name = elem.profile.first_name + " " + (elem.profile.middle_name ? elem.profile.middle_name : "") + " " + elem.profile.last_name;
    this.img = elem.profile.image_url || "";
    this.uid = elem.uid;
    this.rating = (elem.ratings[0] ? elem.ratings[0].rating : "No reviews yet");
    this.speciality = {};
    this.speciality.uid = (elem.specialties? elem.specialties[0].uid : "generalphysician");
    this.speciality.name = (elem.specialties? elem.specialties[0].name : "General Physician");
    this.speciality.description= (elem.specialties? elem.specialties[0].description : " no description");
};


var DoctorDetails = function(elem) {
    this.profile = new Doctor(elem);
    this.phone = elem.practices[0].phones[0].number;
    this.practiceName = elem.practices[0].name;
    this.practiceURL = elem.practices[0].website;
    this.languages = elem.practices[0].languages;
    this.bio = elem.bio;
    this.profileURL = elem.attribution_url;
};

api.post('/condition', function(req, response) {
    console.log("POST /bd recieved");
    var q = {};
    q.query = req.body.c;
    q.location = req.body.location || "37.773,-122.413,100";
    q.user_location = req.body.user_location || "37.773431, -122.403409";
    q.user_key = process.env.BETTER_DOCTOR_KEY;
    var doctors = [];
    rest.get('https://api.betterdoctor.com/2014-09-12/doctors?' + qs.stringify(q)).on('complete', function(data) {
        data.data.forEach(function(elem) {
            var doctor = new Doctor(elem);
            doctors.push(doctor);
        });
        response.json(doctors);

    });
});


api.get('/doctors/:uid', function(req, response) {
    console.log("GET /uid recieved");
    rest.get('https://api.betterdoctor.com/2014-09-12/doctors/' + req.params.uid + '?user_key=' + process.env.BETTER_DOCTOR_KEY).on('complete', function(data) {
        var details = new DoctorDetails(data.data);
        response.json(details);
    });
});
api.get('/doctors/:suid/similar', function(req, response) {
    console.log("GET /similar recieved");
    var q = {};
    q.specialty_uid = req.params.suid;
    q.location = req.body.location || "37.773,-122.413,100";
    q.user_location = req.body.user_location || "37.773431, -122.403409";
    q.user_key = process.env.BETTER_DOCTOR_KEY;
    var doctors = [] ;
    rest.get('https://api.betterdoctor.com/2014-09-12/doctors/?' + qs.stringify(q)).on('complete', function(data) {
        data.data.forEach(function(elem) {
            var doctor = new Doctor(elem);
            doctors.push(doctor);
        });
        response.json(doctors);
    });
});

api.post('/estimate', function(req, res){
    var q = {} ;
    q.start_latitude = Number.parseFloat(req.body.start_latitude);
    q.start_longitude = Number.parseFloat(req.body.start_longitude);
    
    q.end_latitude = Number.parseFloat(req.body.end_latitude);
    q.end_longitude = Number.parseFloat(req.body.end_longitude);
    q.server_token = process.env.UBER_TOKEN;
    console.log(q);
    console.log(req.body);
    rest.get('https://api.uber.com/v1/estimates/price?'+qs.stringify(q)).on('complete', function(data) {
            res.json(data);
        });
});

api.post('/time', function(req, res){
    var q = {} ;
    q.start_latitude = Number.parseFloat(req.body.start_latitude);
    q.start_longitude = Number.parseFloat(req.body.start_longitude);
    q.server_token = process.env.UBER_TOKEN;
    console.log(q);
    console.log(req.body);
    rest.get('https://api.uber.com/v1/estimates/time?'+qs.stringify(q)).on('complete', function(data) {
            res.json(data);
        });
});


module.exports = api;