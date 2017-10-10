import React from 'react'
import image from '../images/cloud-upload-download-data-transfer.svg'
import Collapsible from './Collapsible'

class App extends React.Component {

  constructor(props){
      super(props);
      this.state = {
          isLoading: true,
          contacts: []
      }
  }
  componentWillMount() {
    localStorage.getItem('contacts') && this.setState({
      contacts: JSON.parse(localStorage.getItem('contacts')),
      isLoading: false
    })
  }
  componentDidMount(){
    !localStorage.getItem('contacts') ? this.fetchData()
    : console.log('using data from localStorage')
  }
  componentWillUpdate(nextProps, nextState){
    localStorage.setItem('contacts', JSON.stringify(nextState.contacts))
    localStorage.setItem('contactsDate', Date.now())
  }
  fetchData(){
      this.setState({
          isLoading: true,
          contacts: []
      })

      fetch('https://randomuser.me/api/?results=05&nat=us,dk,fr,gb')
      .then(response => response.json())
      .then(parsedJSON => parsedJSON.results.map(user => (
        {
          name: `${user.name.first} ${user.name.last}`,
          username: `${user.login.username}`,
          email: `${user.email}`,
          location: `${user.location.city}`,
          picture: `${user.picture.thumbnail}`
        }
      )))
      .then(contacts => this.setState({
        contacts,
        isLoading: false
      }))

      .catch(error => console.log('parsing failed', error))
  }

    render() {
      const {isLoading, contacts} = this.state
      return (
        <div>
            <header>
                <img src={image} />
                <h1>Fetching Data <button className="btn btn-sm btn-danger">Fetch now</button></h1>
            </header>
            <div className={`content ${isLoading ? 'is-loading' : ''}`}>
                <div className="panel-group">
                    {
                        !isLoading && contacts.length > 0 ? contacts.map(contact => {
                            const {username, name, email, picture, location} = contact
                            return <Collapsible key={username} title={name}>
                              <img src={picture} className="pull-left"/>
                                <p className="pull-right">{email}<br /><strong>City: </strong>{location}</p>
                            </Collapsible>
                        }) : null
                    }
                </div>
                <div className="loader">
                    <div className="icon"></div>
                </div>
            </div>
        </div>
    );
  }
}
export default App
