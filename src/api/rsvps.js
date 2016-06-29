'use strict';

var express = require('express');

var Rsvp = require('../models/rsvp');
// var Event = require('../models/event'); // Might be Needed for certain searches

var router = express.Router();

/*-----------------
--  RSVP routes  --
-----------------*/

// A GET route to list all RSVPs. Probably won't be needed for final version.
router
.get('/',function(req,res) {
  Rsvp.find({}, function(err,rsvps){
    if (err){
      console.log(err);
      return res.status(503).json({message: err.message, call: 'GET /rsvps'});
    }
    return res.json({rsvps: rsvps});
  });
})

// A POST route to Create new RSVP entries
.post('/', function(req,res){
  var rsvp = req.body;
  console.log('POST /rsvp:',rsvp);
  Rsvp.create(rsvp, function(err,rsvp){
    if (err) {
      return res.status(503).json({err: err.message, call: 'POST /rsvps'});
    }
    res.json({'rsvp':rsvp, message: 'RSVP Created'});
  });
})

// A GET route with eventHash argument to get rsvp list for that event
.get('/:eventHashArg',function(req,res) {
  var eventHashArg = req.params.eventHashArg;
  Rsvp.find({eventHash: eventHashArg}, function(err,rsvps){
    if (err){
      console.log(err);
      return res.status(503).json({message: err.message, call: 'GET /rsvps/:eventHash'});
    }
    res.json({rsvps: rsvps});
  });
})

// A PUT route to update existing entries. Changing RSVP status will need this.
.put('/',function(req,res) {
  var userHashArg = req.body.userHash;
  var eventHashArg = req.body.eventHash;
  Rsvp.findOne({userHash:userHashArg, eventHash:eventHashArg}, function(err,rsvp){
    if (rsvp) {
      rsvp.rsvp = req.body.rsvp; // Make the change...
      rsvp.save(function(err) {  // Then save the change.
        if (err){
          console.log(err);
          return res.status(503).json({message: err.message, call: 'PUT /rsvp'});
        }
      });
      return res.json({rsvp: rsvp}); // Puts JSON in the response object.
    } else {
      return res.send('RSVP not found.');
    };
  });
})

// A DELETE route to delete events by eventHash.
.delete('/:id',function(req,res) {
  var idArg = req.params.id;
  Rsvp.findOne({_id: idArg}, function(err,rsvp){
    rsvp.remove(function(err) {
      if (err){
        console.log(err);
        return res.status(503).json({message: err.message, call: 'DELETE /rsvps/:id'});
      }
    });
    return res.send('RSVP deleted.');
  });
})

// end of route chain
;

module.exports = router;
