import { applyMiddleware, combineReducers, compose, createStore } from "redux";
import createSagaMiddleware from "redux-saga";
import { fork } from "redux-saga/effects";

import * as mediaSession from "./mediaSession";
import * as options from "./options";
import * as player from "./player";
import * as queue from "./queue";
import * as searchbarStatus from "./searchbarStatus";
import * as searchedText from "./searchedText";
import * as songs from "./songs";
import * as starred from "./starred";

import thunk from "redux-thunk";

// List of the imported states
const APPS = {
  mediaSession,
  options,
  player,
  queue,
  searchbarStatus,
  searchedText,
  songs,
  starred,
};

// For each imported state, if it has an exported reducer, add it to the list of reducers
const reducers = Object.keys(APPS).reduce((accumulator, item) => {
  if ("reducer" in APPS[item]) {
    accumulator[item] = APPS[item]["reducer"];
  }
  return accumulator;
}, {});

const sagaMiddleware = createSagaMiddleware();
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
const store = createStore(
  combineReducers(reducers),
  composeEnhancers(applyMiddleware(thunk, sagaMiddleware))
);

// In the main saga, execute each saga that is exported from the states
function* mainSaga() {
  const keys = Object.keys(APPS);
  for (let x = 0; x < keys.length; x++) {
    if ("saga" in APPS[keys[x]]) {
      yield fork(APPS[keys[x]]["saga"]);
    }
  }
}

sagaMiddleware.run(mainSaga);

export default store;
