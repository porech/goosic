import { put, select, takeEvery } from "redux-saga/effects"
import { shuffle } from "lodash";
import {PLAYER_PLAY_SONG} from './player';
import { NEXT_SONG } from "../constants";
export const SHUFFLE = {
    NONE:-1,
    NORMAL: 0,
    ALL: 1
}
export const REPEAT = {
    NONE: -1,
    NORMAL: 0,
    ALL: 1
}
export const ADD_QUEUE = "ADD_QUEUE"
export const REMOVE_FIRST_QUEUE = "REMOVE_FIRST_QUEUE"
export const QUEUE_NEXT_SONG = "QUEUE_NEXT_SONG"
export const QUEUE_PREVIOUS_SONG = "QUEUE_PREVIOUS_SONG"
export const PLAY_LATEST_QUEUE = "PLAY_LATEST_QUEUE"
export const QUEUE_ADD_SONG = "QUEUE_ADD_SONG"
export const NEXT_QUEUE = "NEXT_QUEUE"

//export const REMOVE_QUEUE = "REMOVE_QUEUE"
const getQueuedSong = state => {
    const { queues, queuesShuffled, currentQueueIndex, currentIndex, shuffle} = state.queue;
    //if shuffle is enabled, use the shuffled queue, else use the normal queue
    return shuffle !== SHUFFLE.NONE ? queuesShuffled[currentQueueIndex][currentIndex] : queues[currentQueueIndex][currentIndex]
  }

//#TODO should return songs based on the context we're on; for instance, if the context is an artist view, should return songs made by this artist
const getContextSongs = state => {
    return state.songs.songs;
}

let defaultState = {
    queues: [[]],
    queuesShuffled: [],
    currentIndex: -1,
    currentQueueIndex: 0,
    shuffle: SHUFFLE.NONE,
    repeat: REPEAT.NONE
}
export const reducer = (state = defaultState, action) => {
    let { currentIndex, currentQueueIndex, queues, repeat} = state;
    switch(action.type) {
        case ADD_QUEUE:
            if (queues.length === 5) put({type: REMOVE_FIRST_QUEUE})
            queues.push(action.payload)
            return {
                ...state,
                queues: queues
            }
        case QUEUE_ADD_SONG:
            queues[currentQueueIndex].push(action.payload.song)
            //setting currentIndex to length because it will be next index (to go next)
            return {
                ...state,
                queues,
                currentIndex: queues[currentQueueIndex].length
            }
        case REMOVE_FIRST_QUEUE:
            return {
                ...state,
                queues: queues.splice(0)
            }
        case NEXT_QUEUE:
            return {
                ...state,
                currentQueueIndex: currentQueueIndex+1,
                currentIndex: 0
            }
        case QUEUE_NEXT_SONG:
            //check if we're on the last track in the queue, and there's another queue to switch to
            if (currentIndex === queues[currentQueueIndex].length - 1 && queues[currentQueueIndex+1]) {
                console.log("switching to next queue")
                switch (repeat) {
                    case REPEAT.NONE || REPEAT.ALL:
                        //if repeat is not set, we try to switch to the next queue, first song if we're not in the last one
                        if (currentQueueIndex < queues[currentQueueIndex].length - 1) return { ...state, currentQueueIndex: currentQueueIndex+1, currentIndex: 0}
                        //if we're in the last queue and repeat is not set, just do nothing
                        if (currentQueueIndex === queues[currentQueueIndex].length - 1 && repeat === REPEAT.NONE) return { ...state}
                        //if we're in the last queue and repeat is set to ALL, we start again from first queue, first song
                        if (currentQueueIndex === queues[currentQueueIndex].length - 1 && repeat === REPEAT.ALL) return {...state, currentQueueIndex: 0, currentIndex: 0}
                        break;
                    case REPEAT.NORMAL:
                        //if we're repeating in normal mode, we should just repeat the current queue
                        return {...state, currentIndex: 0}

                }
            }
            return {
                ...state,
                currentIndex: currentIndex+1
            }
        case PLAY_LATEST_QUEUE:
            return {
                ...state,
                currentQueueIndex: queues.length - 1,
                currentIndex: 0
            }
        case QUEUE_PREVIOUS_SONG:
            //check if we're on the first track in the queue and there's another queue to switch to
            if (currentIndex === 0 && queues[currentQueueIndex-1]) {
                switch (repeat) {
                    case REPEAT.NONE || REPEAT.ALL:
                        //if repeat is not set, we try to switch to the previous queue, last song if we're not in the first one
                        if (currentQueueIndex > 0) return { ...state, currentQueueIndex: currentQueueIndex-1, currentIndex: queues[currentQueueIndex-1].length - 1}
                        //if we're in the first queue and repeat is not set, just do nothing
                        if (currentQueueIndex === 0 && repeat === REPEAT.NONE) return { ...state}
                        //if we're in the first queue and repeat is set to ALL, we start again from last queue, last song
                        if (currentQueueIndex === 0 && repeat === REPEAT.ALL) return {...state, currentQueueIndex: queues.length - 1, currentIndex: queues[queues.length-1].length - 1}
                        break;    
                    case REPEAT.NORMAL:
                        //if we're repeating in normal mode, we should just repeat the current queue
                        return {...state, currentIndex: queues[currentQueueIndex].length - 1}
                }
            }
            return {
                ...state,
                currentIndex: currentIndex-1
            }
        default:
            return state;

    }

}

function* addQueue(action) {
    if (action.playNow) {
        yield put({type: PLAY_LATEST_QUEUE})
    }
}
function* playSong() {
    const song = yield select(getQueuedSong)
    if (song === undefined) {
        //get some songs and add them to queue
        let songs = yield select(getContextSongs)
        //#TODO take x different songs to each call
        yield put({
            type: ADD_QUEUE,
            payload: songs.slice(0,15),
            playNow: true
        })
    } else {
        console.log("song", song)
        yield put({
            type: PLAYER_PLAY_SONG,
            payload: song
        })
    }
}

export function* saga() {
    yield takeEvery("ADD_QUEUE", addQueue)
    yield takeEvery("QUEUE_NEXT_SONG", playSong)
    yield takeEvery("QUEUE_PREVIOUS_SONG", playSong)
    yield takeEvery("QUEUE_ADD_SONG", playSong)
    yield takeEvery("PLAY_LATEST_QUEUE", playSong)

}