"use strict"

const http = require('http');
const Bot = require('messenger-bot');
const levDist = require("./levDist");

// Define the facebook bot
let bot = new Bot({
  token: 'EAADGpoZCyCRcBAOZA2i9FsMiY1wVHbM22jGZBGQJ2OFkAJlwdJUHe5LCwQkoDoI2oBF8L0kVQ7hq9OQwUmIZA9rFhQ8ZARgJhZBWzKpaKoBFxaSakC8d39EappYPJCLoEhZBZAtZAZAqCNl5RMk6OgnAyzlQe4ZCFgxcDRecw0iOHjeBgZDZD',
  verify: 'bobisawesome',
  app_secret: '7bae25c8323ee33dacc3ba946aa6ff06'
});

// Generate a text message
const textMessage = message => ({"text": message});

// Generate a message with postback buttons 
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

// Compute the best possible answer given an input 
const computeAnswer = (input, profile) => {
    const welcomeMessage = "Hello ${profile.first_name}, welcome on LingoBot!\nHow are you doing";
    const knownAnswers = {
       "Hello": textMessage("How are you doing?"), 
       "I am do well, thanks!": buttonMessage('Did you mean "doing well"?', [{t:"Yes", p: "correctionOK"}, {t:"No", p:"none"}]),
       'I like “Fußball”': textMessage('"Fußball" is "Football" in English'), 
       "I have to go, bye!": buttonMessage("Do you want to receive advanced feedback for 1CHF a month?\n",[{t:"Yes",p:"subscriptionYes"},{t:"No","p":"none"}]),  
       "Yes": textMessage("Here are your biggest mistakes\nI do well -> I am doing well\nRepartition of mistakes\nPHOTO!")
    }
	if(input.indexOf("@")>0){
		return textMessage("Thanks a lot! Please visit www.lingobot.co for more information.");
	}
	else {
        input = input.toLowerCase();
		// let key = "";
		let response = knownAnswers["I have to go, bye!"]; 
		let responseDistance = 20;
		for(let candidate in knownAnswers) {
            if(input.indexOf(candidate+" ")>0) {
                return knownAnswers[candidate]; 
            }
			const distance = levDist(candidate,input); 
			if(distance<responseDistance) {
				//key = candidate;
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

// Handle text messages
bot.on('message', (payload, reply) => {
  bot.getProfile(payload.sender.id, (err, profile) => {
    if (err) {
        console.log("Error to get profile: "+err);
    }
    let answer = computeAnswer(payload.message.text,profile);
    reply(answer, (err) => {
      if (err) {
        console.log("Error when sending message answer: "+answer)
      }
      console.log(`Echoed back to ${profile.first_name} ${profile.last_name}: ${answer}`)
    });
  });
});

// Handle postback messages
bot.on('postback', (payload,reply) => {
   const responses = {
      "correctionOK": buttonMessage("Cool. What do you want to talk about today?" ,[{t:"Sports", p: "sports"}, {t:"News", p:"none"}, {t:"Famous People", p:"none"}]),
      "sports": textMessage("What’s your favorite sport?"), 
      "subscriptionYes": textMessage("Here are your major areas of improvement\nI do well -> I am doing well\nRepartition per mistakes\n  Vocabulary: 50%\n  Grammar: 30%\n  Puncuation: 10%"),
      "none": textMessage("Sorry I didn't understand")
   }
   let response = responses.none;
   if(payload.postback.payload in responses) {
     response = responses[payload.postback.payload]; 
   } 
   reply(response, (err) => {
       if(err) {
         console.log('error sending');
         console.log(payload);
       }
   });
});
const port = process.env.PORT || 5000;
http.createServer(bot.middleware()).listen(port);
console.log('Echo bot server running at port '+port);
