import { Component } from 'react'
import styles from './Introduction.css'

export default class Introduction extends Component {
  render () {
    return (
      <div className={styles.container}>
        <h1>your website's name</h1>
        <p>bla bla bla...</p>
      </div>
    )
  }
}
