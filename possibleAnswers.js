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

module.exports = {
  GREETINGS: textMessage("How are you doing?"), 
  DO_WELL:  buttonMessage('Did you mean "doing well"?', [{t:"Yes", p: "correctionOK"}, {t:"No", p:"none"}]),
  FUSSBALL: textMessage('"Fußball" is "Football" in English'), 
  FEEDBACK_Q: buttonMessage("Do you want to receive advanced feedback for 1CHF a month?\n",[{t:"Yes",p:"subscriptionYes"},{t:"No","p":"none"}]),  
  FEEDBACK_R: textMessage("Here are your major areas of improvement\nI do well -> I am doing well\nRepartition per mistakes\n  Vocabulary: 50%\n  Grammar: 30%\n  Puncuation: 10%"),
  CONV_SUBJECT: buttonMessage("Cool. What do you want to talk about today?" ,[{t:"Sports", p: "sports"}, {t:"News", p:"none"}, {t:"Famous People", p:"none"}]),
  SPORT_Q: textMessage("What’s your favorite sport?"), 
  DUMB: textMessage("Sorry I didn't understand"), 
  BYE: textMessage("Thanks a lot! Please visit www.lingobot.co for more information.")
}