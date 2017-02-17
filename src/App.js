import React, { Component } from 'react'
import firebase from 'firebase'
import logo from './logo.svg'
import FileUpload from './FileUpload'
import './App.css';

class App extends Component {


constructor () {
  super()
  this.state = {
    user: null,
    pictures: []
  }

  this.handleAuth = this.handleAuth.bind(this)
  this.handleLogout = this.handleLogout.bind(this)
  this.handleUpload = this.handleUpload.bind(this)
}

//manejador del estado del usuario (logueado o deslogueado)
componentWillMount () {
    // Cada vez que el método 'onAuthStateChanged' se dispara, recibe un objeto (user)
    // Lo que hacemos es actualizar el estado con el contenido de ese objeto.
    // Si el usuario se ha autenticado, el objeto tiene información.
    // Si no, el usuario es 'null'
  firebase.auth().onAuthStateChanged(user => {
    this.setState({ user })
  })

  firebase.database().ref('pictures').on('child_added', snapshot => {
    this.setState({
      pictures: this.state.pictures.concat(snapshot.val())
    })
  })
}


//Manejador de inicio de sesión
handleAuth () {
  const provider = new firebase.auth.GoogleAuthProvider()
  firebase.auth().signInWithPopup(provider)
  .then(result => console.log(`${result.user.email} Ha iniciado sesión`))
  .catch(error => console.log(`Error ${error.code}: ${error.message}`))
}

//Manejador de salida de sesión
handleLogout () {
  firebase.auth().signOut()
   .then(result => console.log(`${result.user.email} ha iniciado sesión`))
   .catch(error => console.log(`Error ${error.code}: ${error.message}`));
}

//manejador de subida de imagenes
handleUpload (event) {
    let file = event.target.files[0]
    let storageRef = firebase.storage().ref(`/pictures/${file.name}`)
    let task = storageRef.put(file)

    task.on('state_changed', snapshot => {
          let prercentage = (snapshot.bytesTransferred / snapshot.totalBytes) * 100
          this.setState({
      uploadValue: prercentage
          })
    }, error => {
      console.error(error.message)
    }, () => {
        let record = {
          photoURL: this.state.user.photoURL,
          displayName: this.state.user.displayName,
          image: task.snapshot.downloadURL
      }
      const dbRef = firebase.database().ref('pictures')
      let newPicture = dbRef.push()
      newPicture.set(record)
    })
  }

//renderizado del boton de ingreso
renderLoginButton () {
  if (!this.state.user) {
    return (
         <button className='button' onClick={this.handleAuth}> Ingresar con Google</button>
      )
  }else {
    return (
        <div>
          <img className="avatar" src={this.state.user.photoURL} alt={this.state.user.displayName}/>
          <p>Hola, { this.state.user.displayName } !</p>
          <button className='button' onClick={this.handleLogout}> Salir</button>

          <FileUpload onUpload={this.handleUpload}/>

          {
            this.state.pictures.map(picture => (
              <div>
                <img className='foto' src={picture.image} alt=''/><br/>
                <img className="avatar" src={picture.photoURL} alt={picture.displayName}/><br/>
                <span>{picture.displayName}</span>
              </div>
            )).reverse()
          }

        </div>
      
    )
  }
}


//renderizado de la vista
 render() {
    return (
      <div className="App">
          <div className="App-header">
            <img src={logo} className="App-logo" alt="logo" />
            <h2>InstaReact</h2>
          </div>
          <p className="App-intro">
          {this.renderLoginButton()}
          </p>
      </div>
    )
  }

}

//exportacion de la app
export default App
