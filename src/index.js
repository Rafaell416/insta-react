import React from 'react'
import ReactDOM from 'react-dom'
import firebase from 'firebase'
import App from './App'
import './index.css'

firebase.initializeApp({
	apiKey: "AIzaSyDUSFA81yBJ1qexcp4ps4ANroIHDhGmY2E",
    authDomain: "instareact-cd8cc.firebaseapp.com",
    databaseURL: "https://instareact-cd8cc.firebaseio.com",
    storageBucket: "instareact-cd8cc.appspot.com",
    messagingSenderId: "131008439484"
})

ReactDOM.render(
  <App />,
  document.getElementById('root')
)
