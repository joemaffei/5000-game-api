import firebase from 'firebase'
import secret from '../secret'


firebase.initializeApp(secret.firebase)

const db = firebase.database()


export default db