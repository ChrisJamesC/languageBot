"use strict"

const http = require('http');
const Bot = require('messenger-bot');
const levDist = require("./levDist");
const questions = require("./questionList").questions;
const users = require("./users");

// Define the facebook bot
let bot = new Bot({
  token: 'EAADGpoZCyCRcBAOZA2i9FsMiY1wVHbM22jGZBGQJ2OFkAJlwdJUHe5LCwQkoDoI2oBF8L0kVQ7hq9OQwUmIZA9rFhQ8ZARgJhZBWzKpaKoBFxaSakC8d39EappYPJCLoEhZBZAtZAZAqCNl5RMk6OgnAyzlQe4ZCFgxcDRecw0iOHjeBgZDZD',
  verify: 'bobisawesome',
  app_secret: '7bae25c8323ee33dacc3ba946aa6ff06'
});


// Compute the best possible answer given an input
const computeAnswer = (input, profile) => {
    const knownAnswers = {
       "Hello": ANS.GREETINGS,
       "I am do well, thanks!": ANS.DO_WELL,
       'I like “Fußball”': ANS.FUSSBALL,
       "I have to go, bye!": ANS.FEEDBACK_Q,
       "yes": ANS.WE_AGREE,
       "no": ANS.WHY_NOT,
       "bye": ANS.BYE,
    }
	if(input.indexOf("@")>0){
		return ANS.BYE;
	}
	else {
        input = input.toLowerCase();
		let response = ANS.DUMB;
		let responseDistance = 15;
		for(let candidate in knownAnswers) {
            if(input.indexOf(candidate+" ")>0) {
                return knownAnswers[candidate];
            }
			const distance = levDist(candidate,input);
			if(distance<responseDistance) {
				response = knownAnswers[candidate];
				responseDistance = distance;
			}
		}
		return response;
	}
}

// Log errors
bot.on('error', (err) => {
  console.log("Error message from fb: "+err.message);
});


const buttonMessage = (message, options) => ({
  "attachment":{
    "type":"template",
    "payload":{
      "template_type":"button",
      "text": message,
      "buttons":options.map(d=> ({
        "type":"postback",
        "title":d.t,
        "payload":d.p
      }))
    }
  }
});
const textMessage = message => ({"text": message});

const getRandomQuestionId = () => Math.floor(Math.random()*questions.length);

const sendQuestion = (reply) => {
    const questionId = getRandomQuestionId();
    const question = questions[questionId];
    const response = buttonMessage(question.question,question.answers.map((a,i) => ({
        t: a,
        p: ""+questionId+"_"+i
    })));
    reply(response, (err) => {
        if(err) {
          console.log('Postback error sending: '+payload);
        }
    });
}

const sendFeedback = (userID, response, reply) =>  {
   const arr = response.split("_");
   if(arr.length<2) {
       console.log("Error with response: "+response);
       return;
   }
   const questionId = parseInt(arr[0]);
   const answerId = parseInt(arr[1]);
   console.log("Response: "+response);
   console.log("questionId: "+questionId);
   console.log("questions: "+questions);
   const question = questions[questionId];
   const correct = question.correct===answerId;
   const message = correct?
                textMessage("You are correct. 🎉"):
                textMessage("You are wrong. The correct answer was "+question.answers[question.correct]+".");

    reply(message, (err) => {
        if(err) {
          console.log('Postback error sending: '+payload);
        }
    });

    users.add_answer(userID, questionId, correct);

}

const sendStats = (userID, reply) => {
    const user_stats = users.get_user_stats(userID);

    const message = textMessage(user_stats);

    reply(message, (err) => {
        if(err) {
          console.log('Postback error sending: '+payload);
        }
    });
}

// Handle text messages
bot.on('message', (payload, reply) => {
  sendQuestion(reply);
});

// Handle postback messages
bot.on('postback', (payload,reply) => {
   const response = payload.postback.payload;
   const userID = payload.sender.id;
   sendFeedback(userID, response, reply);
   sendStats(userID, reply);
   sendQuestion(reply);
});

const port = process.env.PORT || 5000;
http.createServer(bot.middleware()).listen(port);
console.log('Echo bot server running at port '+port);
