"use strict";

let users = {};

const add_user = userID => {
    users[userID] = {
        answers : []
    };
}

const add_answer = (userID, questionID, isCorrect) => {
    if (!(userID in users)) {
        add_user(userID);
    }

    users[userID].answers.push({questionID, isCorrect});

}

const get_user_stats = userID => {
    if (userID in users) {
        const answers = users[userID].answers;
        const num_correct = answers.filter(a => a.isCorrect).length;
        const total = answers.length;

        return "You answered correctly " + num_correct + " questions out of " + total + ".";

    } else {
        return "";
    }
}

module.exports = ({add_user, add_answer, get_user_stats});
