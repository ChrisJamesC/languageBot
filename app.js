"use strict"

const http = require('http')
const Bot = require('messenger-bot')

let bot = new Bot({
  token: 'EAADGpoZCyCRcBAOZA2i9FsMiY1wVHbM22jGZBGQJ2OFkAJlwdJUHe5LCwQkoDoI2oBF8L0kVQ7hq9OQwUmIZA9rFhQ8ZARgJhZBWzKpaKoBFxaSakC8d39EappYPJCLoEhZBZAtZAZAqCNl5RMk6OgnAyzlQe4ZCFgxcDRecw0iOHjeBgZDZD',
  verify: 'bobisawesome',
  app_secret: '7bae25c8323ee33dacc3ba946aa6ff06'
})

bot.on('error', (err) => {
  console.log(err.message)
})


bot.on('message', (payload, reply) => {
  let text = payload.message.text
  console.log("INPUT"+text)
  console.log(text)
  bot.getProfile(payload.sender.id, (err, profile) => {
    console.log(err)
    if (err) {
        throw err
    }
    const knownAnswers = {
        "Hello": `Hi ${profile.first_name}, how are you doing?`, 
        "Fine and you?": "Very well. Do you want to talk about politics or sports?", 
        "Sports": "What's your favorite sport?", 
        "I love soccer!": "Awesome, me too!", 
        "Bye!": "You did very well today! See you tomorrow!"
    }

    let answer = "Sorry, I didn't understand"

    if(text in knownAnswers) {
        answer = knownAnswers[text];      
    }

    console.log("ANSWER: "+answer)
    reply({ answer }, (err) => {
      if (err) {
    
        console.log(err)
        throw err
      }

      console.log(`Echoed back to ${profile.first_name} ${profile.last_name}: ${text}`)
    })
  })
})

const port = process.env.PORT || 5000
http.createServer(bot.middleware()).listen(port)
console.log('Echo bot server running at port '+port)
