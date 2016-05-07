"use strict"

const http = require('http')
const Bot = require('messenger-bot')

let bot = new Bot({
  token: 'EAADGpoZCyCRcBAOZA2i9FsMiY1wVHbM22jGZBGQJ2OFkAJlwdJUHe5LCwQkoDoI2oBF8L0kVQ7hq9OQwUmIZA9rFhQ8ZARgJhZBWzKpaKoBFxaSakC8d39EappYPJCLoEhZBZAtZAZAqCNl5RMk6OgnAyzlQe4ZCFgxcDRecw0iOHjeBgZDZD',
  verify: 'bobisawesome',
  app_secret: '7bae25c8323ee33dacc3ba946aa6ff06'
})

const levenshteinDistance = (s, t)  => {
    if (!s.length) return t.length;
    if (!t.length) return s.length;

    return Math.min(
        levenshteinDistance(s.substr(1), t) + 1,
        levenshteinDistance(t.substr(1), s) + 1,
        levenshteinDistance(s.substr(1), t.substr(1)) + (s[0] !== t[0] ? 1 : 0)
    ) + 1;
}

const computeAnswer = (input, profile) => {
    const knownAnswers = {
        "Hello": `Hi ${profile.first_name}, how are you doing?`, 
        "Fine and you?": "Very well. Do you want to talk about politics or sports?", 
        "Sports": "What's your favorite sport?", 
        "I love soccer!": "Awesome, me too!", 
        "Bye!": "You did very well today! See you tomorrow!"
    }
    let response = "I don't understand"; 
    let responseDistance = 10;
    for(let candidate in knownAnswers) {
        const distance = levenshteinDistance(candidate,input); 
        if(distance<responseDistance) {
            response = knownAnswers[candidate]; 
            responseDistance = distance; 
        }
    }
    return response;
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

    setTimeout(() => reply({ text: answer }, (err) => {
      if (err) {
    
        throw err
      }

      console.log(`Echoed back to ${profile.first_name} ${profile.last_name}: ${text}`)
    }), 1000)
  })
})

const port = process.env.PORT || 5000
http.createServer(bot.middleware()).listen(port)
console.log('Echo bot server running at port '+port)
