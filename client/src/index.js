import React from 'react';
// import ReactDOM from 'react-dom';
import * as ReactDOMClient from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

// router
import { BrowserRouter } from 'react-router-dom';
// redux
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import createSagaMiddleware from 'redux-saga';
import rootReducer, { rootSaga } from './modules';
import { setUser } from './modules/user';

const root = ReactDOMClient.createRoot(document.getElementById('root'));
const sagaMiddleware = createSagaMiddleware();
const store = createStore(
  rootReducer,
  composeWithDevTools(applyMiddleware(sagaMiddleware)),
);

function loadTeacherUser() {
  try {
    const teacher_user = localStorage.getItem('teacher_user');
    if (!teacher_user) return;
    store.dispatch(setUser(JSON.parse(teacher_user)));
  } catch (e) {
    console.log(e);
  }
}

function loadStudentUser() {
  try {
    const student_user = localStorage.getItem('student_user');
    if (!student_user) return;
    store.dispatch(setUser(JSON.parse(student_user)));
  } catch (e) {
    console.log(e);
  }
}

sagaMiddleware.run(rootSaga);
loadTeacherUser();
loadStudentUser();

root.render(
  <Provider store={store}>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </Provider>,
);

// ReactDOM.render(
//   <Provider store={store}>
//     <BrowserRouter>
//       <App />
//     </BrowserRouter>
//   </Provider>,
//   document.getElementById('root'),
// );

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
