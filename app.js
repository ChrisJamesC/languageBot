"use strict"

const http = require('http')
const Bot = require('messenger-bot')

let bot = new Bot({
  token: 'EAADGpoZCyCRcBAOZA2i9FsMiY1wVHbM22jGZBGQJ2OFkAJlwdJUHe5LCwQkoDoI2oBF8L0kVQ7hq9OQwUmIZA9rFhQ8ZARgJhZBWzKpaKoBFxaSakC8d39EappYPJCLoEhZBZAtZAZAqCNl5RMk6OgnAyzlQe4ZCFgxcDRecw0iOHjeBgZDZD',
  verify: 'bobisawesome',
  app_secret: '7bae25c8323ee33dacc3ba946aa6ff06'
})

const maxDistance = 3; 

//http://www.merriampark.com/ld.htm, http://www.mgilleland.com/ld/ldjavascript.htm, Damerau–Levenshtein distance (Wikipedia)
var levDist = function(s, t) {
    var d = []; //2d matrix

    // Step 1
    var n = s.length;
    var m = t.length;

    if (n == 0) return m;
    if (m == 0) return n;

    //Create an array of arrays in javascript (a descending loop is quicker)
    for (var i = n; i >= 0; i--) d[i] = [];

    // Step 2
    for (var i = n; i >= 0; i--) d[i][0] = i;
    for (var j = m; j >= 0; j--) d[0][j] = j;

    // Step 3
    for (var i = 1; i <= n; i++) {
        var s_i = s.charAt(i - 1);

        // Step 4
        for (var j = 1; j <= m; j++) {

            //Check the jagged ld total so far
            if (i == j && d[i][j] > 4) return n;

            var t_j = t.charAt(j - 1);
            var cost = (s_i == t_j) ? 0 : 1; // Step 5

            //Calculate the minimum
            var mi = d[i - 1][j] + 1;
            var b = d[i][j - 1] + 1;
            var c = d[i - 1][j - 1] + cost;

            if (b < mi) mi = b;
            if (c < mi) mi = c;

            d[i][j] = mi; // Step 6

            //Damerau transposition
            if (i > 1 && j > 1 && s_i == t.charAt(j - 2) && s.charAt(i - 2) == t_j) {
                d[i][j] = Math.min(d[i][j], d[i - 2][j - 2] + cost);
            }
        }
    }

    // Step 7
    return d[n][m];
}

const textMessage = message => ({"text": message})
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
})

const computeAnswer = (input, profile) => {
    const welcomeMessage = "Hello ${profile.first_name}, welcome on LingoBot!\nHow are you doing";
    const knownAnswers = {
       "Hello": textMessage("How are you doing?"), 
       "I am do well, thanks!": buttonMessage("Did you mean “doing well?", [{t:"Yes", p: "correctionOK"}, {t:"No", p:"none"}]),
       "Yes": textMessage("Cool. What do you want to talk about today?\n| Sports | News | Famous People |"),
       "Sports": textMessage("What’s your favorite sport?"), 
       'I like “Fußball”': textMessage('"Fußball" is "Football" in English'), 
       "I have to go, bye!": textMessage("Do you want to receive advanced feedback for 1CHF a month?\n| Yes | No |"),  
       "Yes": textMessage("Here are your biggest mistakes\nI do well -> I am doing well\nRepartition of mistakes\nPHOTO!")
    }
	if(input.indexOf("@")>0){
		return textMessage("Thanks a lot! Please visit www.lingobot.co for more information.");
	}
	else {
        input = input.toLowerCase();
		// let key = "";
		let response = textMessage("Sorry I have to go now. Would you like to have some feedback about your mistakes and writing skills?"); 
		let responseDistance = 10;
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
        /*
		if(responseDistance>0 && key.length>0) {
			response = "I understood: \""+key+"\"\n"+response;
		}
        */
		return response;
	}

}

bot.on('error', (err) => {
  console.log(err.message)
})


bot.on('message', (payload, reply) => {
  let text = payload.message.text
  bot.getProfile(payload.sender.id, (err, profile) => {
    if (err) {
        throw err
    }
    let answer = computeAnswer(text,profile);
    reply(answer, (err) => {
      if (err) {
        console.log(answer)
        console.log(answer.attachement.payload.buttons)
        throw err
      }
      console.log(`Echoed back to ${profile.first_name} ${profile.last_name}: ${answer}`)
    })
  })
})

const port = process.env.PORT || 5000
http.createServer(bot.middleware()).listen(port)
console.log('Echo bot server running at port '+port)
