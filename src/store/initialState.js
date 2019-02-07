// import React from 'react';
//

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
    dialogueTimeExpectations: 5,
    dialogueTimeLimit: 4,
    preDialogueSurveyData: {},
    preDialogueSurveyDataPartner: {},
    recallData: {},
    surveyData: {},
    otherData: {}
};

export const micData = {
    publicId: null,
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
    instructions: "Please fill out this survey."
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

export const experimentBlocks = ["introduction", "consent", "micSetup", "micCheck", "preDialogue", "dialogue", "recall", "debrief", "submission"];

export const blocksById = {
    "introduction": introduction, "consent": consent,
    "micSetup": micSetup, "micCheck": micCheck,
    "preDialogue" : preDialogue, "dialogue": dialogue,
    "recall": recall, "debrief": debrief, "submission": submission};

