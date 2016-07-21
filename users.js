let users = {};

const add_user = userID => {
    users.userID = {
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
        return JSON.stringify(users[userID].answers);
    } else {
        return "User not found.";
    }
}

module.export = {add_user, add_answer, get_user_stats};
