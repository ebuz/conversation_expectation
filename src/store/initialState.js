import React from 'react';

export const experimentalData = {
    studyName: 'CE_pilot',
    dialogueCondition: 'longConversation',
    data: {},
    debugMode: true
};

export const switchboardData = {
    status: 'disconnected',
    messages: [],
    selfId: null,
    serverId: null,
    candidatePeer: null,
    peeringConstraints: { unreachable: [] },
    selfSignalData: []
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
    longConversation: <p>In this task you will be completing a few questionnaires as well as having a series of conversations with another mechanical-turker. Overall, you will speak with your partner <b>three times for a total of 15 minutes</b>.</p>,
    shortConversation: <p>In this task you will be completing a few questionnaires as well as having a conversation with another mechanical-turker. You will speak with your partner <b>once for a total of 5 minutes</b>.</p>,
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

const dialogue1 = {
    ...experimentTasksFrame,
    id: 'dialogue1',
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
        options: ['sports', 'family', 'religion', 'money'],
        defaultValue: []
    },
    data: {answersById: new Map()},
};

const dialogueIcebreakers = {
    ...experimentTasksFrame,
    id: 'dialogueIcebreakers',
    instructions: "Our software is currently trying to match you with a partner. Before you speak with your partner, fill out this survey about yourself that will be shared with your partner. Your partner will be filling out the same questions.",
    finishedQuestions: true,
    data: {
        answersById: new Map([
            ['weekendEvents', 'f'],
            ['mturkInteraction', 'n'],
            ['lastConcert', 'l'],
            ['sodaPreference', 'Coke'],
            ['otherLanguages', 'r'],
        ]),
        partnerAnswersById: new Map([
            ['weekendEvents', 'f'],
            ['mturkInteraction', 'n'],
            ['lastConcert', 'l'],
            ['sodaPreference', 'Coke'],
            ['otherLanguages', 'r'],
        ]),
    },
    preDialogueQuestions: [
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
        ],
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
    //partly tested
    'dialogue1': {...dialogue1, finished: false},
    //untested
    'dialogue2': {...dialogue1, id: 'dialogue2', finished: false},
    'dialogue3': {...dialogue1, id: 'dialogue3', finished: false},
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
            'potentialTopics', 'dialogue2', 'dialogueBreak',
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

export const experimentTasks = ["introduction", "consent", "micSetup", "micCheck", "dialogue", "wrapUp", "submission"];

export const experimentTasksById = {
    //tested
    "introduction": {...introduction, finished: false},
    "consent": {...consent, finished: false},
    "micCheck": {...micCheck, finished: false},
    "micSetup": {...micSetup, finished: false},
    //untested
    "dialogue": dialogue,
    "wrapUp": {started: true, finished: true},
    "submission": submission
};
