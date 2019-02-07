const MediaRecorder = window.MediaRecorder;

export { MediaRecorder };

export default class AudioRecorder {
    constructor(stream, onStart = null, onStop = null) {
        this.recordedChunks = [];
        this.recorderOptions = {};
        // mutually exclusive audio encoding formats beween chrome and firefox
        if (MediaRecorder.isTypeSupported('audio/webm;codecs=opus')) {
            this.recorderOptions = {mimeType: 'audio/webm;codecs=opus',
                audioBitsPerSecond: 128000}; //chrome
        } else if (MediaRecorder.isTypeSupported('audio/ogg;codecs=opus')) {
            this.recorderOptions = {mimeType: 'audio/ogg;codecs=opus',
                audioBitsPerSecond: 64000 }; //firefox
        } else {
            this.recorderOptions = {}; //let browser pick
        }
        this.mediaRecorder = new MediaRecorder(stream, this.recorderOptions);
        this.mediaRecorder.ondataavailable = (event) => {
            if (event.data.size > 0) {
                this.recordedChunks.push(event.data);
            }
        }
        if(onStart){
            this.mediaRecorder.onstart = onStart;
        }
        if(onStop){
            this.mediaRecorder.onstop = (event) => {
                onStop(event, this.makeRecording());
            };
        } else {
            this.mediaRecorder.onstop = () => {
                this.makeRecording();
            };
        }
        this.finishedRecording = null;
    }
    record(){
        return new Promise((resolve, reject) => {
            this.mediaRecorder.start();
            this.mediaRecorder.onstop = () => {
                resolve(this.makeRecording());
            }
        });
    }
    start(){
        if(this.mediaRecorder.state === 'inactive'){
            this.mediaRecorder.start();
        }
    }
    stop(){
        if(this.mediaRecorder.state === 'recording'){
            this.mediaRecorder.stop();
        }
    }
    makeRecording(){
        if(this.mediaRecorder.state === 'inactive' && this.recordedChunks.length > 0){
            this.finishedRecording = new Blob(this.recordedChunks, {
                type: this.recorderOptions.mimeType});
            this.recordedChunks = [];
        }
        return(this.finishedRecording);
    }
}

