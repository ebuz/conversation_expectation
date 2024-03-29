import React from 'react';

const shuffleList = list => {
    let currentIndex = list.length;
    let temporaryValue = null;
    let randomIndex = null;
    while (0 !== currentIndex){
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = list[currentIndex];
        list[currentIndex] = list[randomIndex];
        list[randomIndex] = temporaryValue;
    }
    return list;
}

export const experimentalData = {
    studyName: 'CE_pilot',
    dialogueCondition: 'shortConversation',
    data: {},
    debugMode: process.env.NODE_ENV !== 'production'
};

export const switchboardData = {
    status: 'disconnected',
    messages: [],
    selfId: null,
    serverId: null,
    candidatePeer: null,
    peeringConstraints: {
        ignoreSignals: false,
        unreachable: [] },
    selfSignalData: [],
    peerData: []
};

export const mturkData = {
    workerId: '',
    hitId: '',
    assignmentId: '',
    turkSubmitTo: '',
};

export const micData = {
    micInput: null,
    recorder: null,
    recordingState: null,
    speakerOutput: null,
    micTestFile: null,
};

const experimentTasksFrame = {
    started: false,
    finished: false,
    data: {}
};

const introductionByCondition = {
    longConversation: <div><p>In this task you will be completing a few questionnaires as well as having a series of conversations with another mechanical-turker.</p><p>Overall, you will speak with your partner <b>three times for a total of 15 minutes</b>.</p></div>,
    shortConversation: <div><p>In this task you will be completing a few questionnaires as well as having a conversation with another mechanical-turker.</p><p>You will speak with your partner <b>once for a total of 5 minutes</b>.</p></div>,
}

const introduction = {
    ...experimentTasksFrame,
    id: "introduction",
    instructions: introductionByCondition[experimentalData.dialogueCondition]
};

const consent = {
    ...experimentTasksFrame,
    id: "consent",
    consentFileURL: process.env.PUBLIC_URL + "/Stamped-ICD_Qualtrics.pdf",
    instructions: "By clicking 'I consent to participate' below, you confirm that you have read and understood the consent form, that you are willing to participate in this experiment, and that you acknowledge that the anonymized data you provide by participating in this experiment can be used in scientific publications. After you consent we will start to try and pair you with a partner."
};

const micSetup = {
    ...experimentTasksFrame,
    id: "micSetup",
    instructions: "Activate your microphone by clicking the button below. You will be asked to give the site permission to use your microphone. You must say yes to continue the HIT."
};

const micCheck = {
    ...experimentTasksFrame,
    id: "micCheck"
};

const submission = {
    ...experimentTasksFrame,
    id: "submission",
    instructions: "Thank you for participating! Feel free to leave a comment before submitting the HIT."
};

const error = {
    ...experimentTasksFrame,
    id: "error",
    instructions: "Your partner has gone missing and the task cannot continue."
};

const dialogue1 = {
    ...experimentTasksFrame,
    id: 'dialogue1',
    instructions: "When both you and your partner hit the ready botton the conversation will begin and you will hear each other.",
    dialogueTimeLimit: 5 * 60 * 1000, //convert min to ms
    ready: false,
    partnerReady: false,
    timeKeeper: false,
    ended: false,
    dialogueStartTime: null,
    dialogueTime: null,
    dialogueFileName: null,
};

const potentialTopics = {
    ...experimentTasksFrame,
    id: 'potentialTopics',
    topicsQuestion: {
        questionId: 'topicsQuestion',
        questionType: 'checkBoxes',
        label: 'Which of these topics would you consider talking about with your partner? Your answers will not be shared with them.',
        options: shuffleList(['TV shows', 'Music', 'Vacation plans', 'Books', 'Hobbies', 'Work', 'Health', 'Pets', 'Children', 'Religion', 'Government', 'Money']),
        defaultValue: []
    },
    data: {answersById: new Map()},
};

const potentialTopicsRecall = {
    ...experimentTasksFrame,
    id: 'potentialTopicsRecall',
    topicsQuestion: {
        ...potentialTopics.topicsQuestion,
        questionId: 'topicsQuestionRecall',
        questionType: 'checkBoxes',
        label: 'Which of these topics did you talk about with your partner? Your answers will not be shared.',
    },
    data: {answersById: new Map()},
};

const dialogueIcebreakers = {
    ...experimentTasksFrame,
    id: 'dialogueIcebreakers',
    instructions: "Our software is currently trying to match you with a partner. Before you speak with your partner, fill out this survey about yourself that will be shared with your partner. Your partner will be filling out the same questions.",
    finishedQuestions: false,
    data: {
        answersById: new Map(),
        partnerAnswersById: new Map(),
    },
    preDialogueQuestions: shuffleList([
            {
                questionId: 'weekendEvents',
                questionType: 'input',
                type: 'text',
                label: 'What did you do last weekend?',
                defaultValue: ''
            },
            {
                questionId: 'mturkInteraction',
                questionType: 'input',
                type: 'text',
                label: 'Have you ever interacted with another MTurker?',
                defaultValue: ''
            },
            {
                questionId: 'lastConcert',
                questionType: 'input',
                type: 'text',
                label: 'What was the last concert you went to?',
                defaultValue: ''
            },
            {
                questionId: 'sodaPreference',
                questionType: 'select',
                label: 'Do you prefer Coke, Pepsi, or Dr. Pepper?',
                options: ['', "Coke", "Pepsi",
                    "Dr. Pepper", "None of the above"],
                defaultValue: ''
            },
            {
                questionId: 'otherLanguages',
                questionType: 'input',
                type: 'text',
                label: "Do you know any languages other than English? When did you learn them?",
                defaultValue: ''
            },
        ]),
};

const dialogueTasksById = {
    //tested
    'dialogueBreak': {...experimentTasksFrame, id: 'dialogueBreak', finished: false},
    'icebreakersRecall': {...experimentTasksFrame, id: 'icebreakersRecall',
        data: {answersById: new Map()}, finished: false},
    'dialogue1Recall': {...experimentTasksFrame, id: 'dialogue1Recall', data: {transcript: ''}, finished: false},
    'removePartner': {...experimentTasksFrame, id: 'removePartner'},
    'potentialTopics': {...potentialTopics, finished: false},
    'dialogueIcebreakers': {...dialogueIcebreakers, finished: false},
    'findPartner': {...experimentTasksFrame, id: 'findPartner', finished: false},
    'dialogue1': {...dialogue1, finished: false},
    'dialogue2': {...dialogue1, id: 'dialogue2', finished: false},
    'dialogue3': {...dialogue1, id: 'dialogue3', finished: false},
    //untested
    'potentialTopicsRecall': {...potentialTopicsRecall, finished: false},
};

const dialogueConditionsById = {
    shortConversation: {
        dialogueCondition: 'shortConversation',
        studyIdCode: '2f42167b-e18d-493c-8a66-0dc0cf3b1e85',
        dialogueTasks: ['findPartner', 'dialogueIcebreakers',
            'dialogue1', 'removePartner', 'icebreakersRecall', 'dialogue1Recall'
        ],
    },
    longConversation: {
        dialogueCondition: 'longConversation',
        studyIdCode: '2f42167b-e18d-493c-8a66-0dc0cf3b1e86',
        dialogueTasks: ['findPartner', 'dialogueIcebreakers',
            'dialogue1', 'icebreakersRecall', 'dialogue1Recall',
            'potentialTopics', 'dialogue2', 'potentialTopicsRecall',
            'dialogue3', 'removePartner'
        ],
    }
};

const dialogueInstructionsByCondition = {
    longConversation: <p>After we match you with a partner you will speak to them <b>three times</b>. Each time will last <b>five minutes</b>. Between each conversation and after you will have some questionnaires to complete.</p>,
    shortConversation: <p>After we match you with a partner you will speak to them for <b>five minutes</b>. After you speak you have some questionnaires to complete.</p>,
}

const dialogue = {
    ...experimentTasksFrame,
    id: "dialogue",
    instructions: dialogueInstructionsByCondition[experimentalData.dialogueCondition],
    dialogueTasksById: dialogueTasksById,
    ...dialogueConditionsById[experimentalData.dialogueCondition],
};

export const experimentTasks = ["introduction", "consent", "micSetup", "micCheck", "dialogue", "wrapUp", "submission", "error"];

export const experimentTasksById = {
    //tested
    "introduction": {...introduction, finished: false},
    "consent": {...consent, finished: false},
    "micCheck": {...micCheck, finished: false},
    "micSetup": {...micSetup, finished: false},
    //untested
    "dialogue": dialogue,
    "wrapUp": {started: true, finished: true},
    "error": {...error, started: true, finished: true},
    "submission": submission
};
