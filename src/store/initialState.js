// import React from 'react';
//

export const switchboardData = {
    status: 'disconnected',
    messages: [],
    selfId: null,
    serverId: null,
    candidatePeerId: null,
    peeringConstraints: {},
    selfSignalData: []
};

export const mturkData = {
    workerId: '',
    hitId: '',
    assignmentId: '',
    turkSubmitTo: '',
};

export const experimentalData = {
    studyName: 'CE_pilot',
    studyCondition: 'short',
    studyIdCode: '2f42167b-e18d-493c-8a66-0dc0cf3b1e85',
    dialogueTimeExpectations: 5 * 60 * 1000, //convert min to ms
    dialogueTimeLimit: 4 * 60 * 1000, //convert min to ms
    preDialogueAnswersById: new Map(),
    preDialoguePartnerAnswersById: null,
    dialogueStatus: {
        ready: false,
        partnerReady: false,
        timeKeeper: false,
        started: false,
        ended: false,
        dialogueStartTime: null,
        dialogueTime: null,
    },
    dialogueFileName: null,
    recallData: '',
    surveyData: {},
    otherData: {},
    debugMode: false
};

export const micData = {
    micInput: null,
    recorder: null,
    recordingState: null,
    speakerOutput: null,
    micTestFile: null,
}

const introduction = {
    blockId: "introduction",
    finished: false,
    instructions: "In this task you will fill out a survey then speak with a partner for a short period of time. After the conversation you will be asked to answer some questions about the conversation and your partner."
};

const consent = {
    blockId: "consent",
    finished: false,
    consentFileURL: process.env.PUBLIC_URL + "/Stamped-ICD_Qualtrics.pdf",
    instructions: "By clicking 'I consent to participate' below, you confirm that you have read and understood the consent form, that you are willing to participate in this experiment, and that you acknowledge that the anonomized data you provide by participating in this experiment can be used in scientific publications. After you consent we will start to try and pair you with a partner."
};

const micSetup = {
    blockId: "micSetup",
    finished: false,
    instructions: "Activate your microphone by clicking the button below. You will be asked to give us permission to use your microphone. To continue the HIT you must grant the website permission."
};

const micCheck = {
    blockId: "micCheck",
    finished: false,
};

const preDialogue = {
    blockId: "preDialogue",
    finished: false,
    instructions: "Our software is currently trying to match you with a partner. Before you speak with your partner, fill out this survey about yourself. Your partner will be filling out the same questions.",
    finishedPreDialogueQuestions: false,
    preDialogueQuestions: [
            {
                questionId: 'sodaPreference',
                questionType: 'select',
                label: 'Do you prefer Coke, Pepsi, or Dr. Pepper?',
                options: ['', "Coke", "Pepsi",
                    "Dr. Pepper", "None of the above"],
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
                questionId: 'mturkInteraction',
                questionType: 'input',
                type: 'text',
                label: 'Have you ever interacted with another MTurker?',
                defaultValue: ''
            },
            {
                questionId: 'otherLanguages',
                questionType: 'input',
                type: 'text',
                label: "Do you know any languages other than English? Which ones?",
                defaultValue: ''
            },
        ]
};

const dialogue = {
    blockId: "dialogue",
    finished: false,
    instructions: "Have a conversation."
};

const recall = {
    blockId: "recall",
    finished: false,
    instructions: "Please describe your conversation."
};

const debrief = {
    blockId: "debrief",
    finished: false,
    instructions: "You were mildly decieved."
};

const submission = {
    id: "submission",
    finished: false,
    instructions: "Please fill out this survey."
};

export const experimentBlocks = ["introduction", "consent", "micSetup", "micCheck", "preDialogue", "dialogue", "recall", "submission"];

export const blocksById = {
    "introduction": introduction, "consent": consent,
    "micSetup": micSetup, "micCheck": micCheck,
    "preDialogue": preDialogue,
    "dialogue": dialogue,
    "recall": recall, "debrief": debrief, "submission": submission};

