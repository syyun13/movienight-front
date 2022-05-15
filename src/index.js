import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Login, Main, Signup, MyPage, Event, Rank, FindEvent, Friends } from './pages';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <Router>
    <Routes>
      <Route exact path="/" element={<Login />}></Route>
      <Route exact path="/signup" element={<Signup />}></Route>
      <Route exact path="/main" element={<Main />}></Route>
      <Route exact path="/mypage" element={<MyPage />}></Route>
      <Route exact path="/event" element={<Event />}></Route>
      <Route exact path="/rank" element={<Rank />}></Route>
      <Route exact path="/findevent" element={<FindEvent />}></Route>
      <Route exact path="/friends" element={<Friends />}></Route>
    </Routes>
  </Router>
);