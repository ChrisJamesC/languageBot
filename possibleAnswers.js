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
  GREETINGS: textMessage("Hello! How are you doing?"), 
  DO_WELL:  buttonMessage('Did you mean "doing well"?', [{t:"Yes", p: "correctionOK"}, {t:"No", p:"correctionBad"}]),
  FUSSBALL: textMessage('"Fußball" is "Football" in English'),
  FEEDBACK_Q: buttonMessage("Do you want to receive advanced feedback for 1CHF a month?\n",[{t:"Yes",p:"subscriptionYes"},{t:"No","p":"subscriptionNo"}]),
  FEEDBACK_R: textMessage("Here are your major areas of improvement\nI do well -> I am doing well\nRepartition per mistakes\n  Vocabulary: 50%\n  Grammar: 30%\n  Puncuation: 10%"),
  CONV_SUBJECT: buttonMessage("Cool. What do you want to talk about today?" ,[{t:"Sports", p: "sports"}, {t:"News", p:"news"}, {t:"Famous People", p:"famousPeople"}]),
  SPORT_Q: textMessage("What’s your favorite sport?"),
  NEWS_Q: textMessage("What do you think about Donald Trump?"),
  FAMOUS_PEOPLE_Q: textMessage("What's Kim Kardashian the best at?"),
  DUMB: textMessage("Sorry I didn't understand"),
  BYE: textMessage("Thanks a lot! Please visit www.lingobot.co for more information."),
  WHY_NOT: textMessage("Why not?"),
  WE_AGREE: textMessage("That's what I thought!")
}
