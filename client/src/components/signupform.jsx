import React from 'react';
import ReactDOM from 'react-dom';
import { Redirect } from 'react-router-dom';
import $ from 'jquery';
import Navbar from './navbar.jsx';
import { Card, TextField, RadioButton, RadioButtonGroup, RaisedButton } from 'material-ui';

class SignupForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      username: this.props.location.state.username,
      password: '',
      type: 'host',
      email: '',
      location: '',
      profileUrl: '',
      description: '',
      errors: {},
      redirectToProfile: false
    }
    this.handleChange = this.handleChange.bind(this);
    this.onSelect = this.onSelect.bind(this);
  }

  handleSubmit(e) {
    e.preventDefault();

    let clearedState = {}
    $.ajax({
      type: 'POST',
      url: '/signup',
      data: {
        username: this.state.username,
        password: this.state.password,
        type: this.state.type,
        email: this.state.email,
        location: this.state.location,
        profileUrl: this.state.profileUrl,
        description: this.state.description
      },
      success: (data) => {
        console.log(data)
        if (data.errors) {
          this.setState({
            errors: data.errors
          });
        } else {
          this.setState({
            redirectToProfile: true,
            user: data,
          });
        }
      },
      error: (data) => {
        console.log('error posting data', data);
      }
    });

    this.setState(clearedState);
  }

  handleChange(e) {
    const target = e.target.name;
    this.setState({
      [ target ]: e.target.value
    })
  }

  onSelect(e) {
    console.log(e.target.value)
    this.setState({
      type: e.target.value
    });
  }

  render () {
    if (this.state.redirectToProfile) {
      return <Redirect to={{ pathname: '/login', state: this.state }} />
    }
    return (
      <div>
        <Navbar link="Login" linkurl="/login"/>
        <Card className="container signupform">
          <form action="/" onSubmit={this.handleSubmit.bind(this)} >
            <h2>Create Your Profile</h2>
            <RadioButtonGroup name="Usertype" defaultSelected="host" onChange={this.onSelect}>
              <RadioButton value="host" label="Host"/>
              <RadioButton value="petOwner" label="Pet Owner"/>
            </RadioButtonGroup>
            <div className="field-line">
              <TextField floatingLabelText="Username" name="username" onChange={this.handleChange} value={this.state.username} errorText={ this.state.errors.username }/>
            </div>
            <div className="field-line">
                <TextField floatingLabelText="Password" name="password" type="password" value={this.state.password} onChange={this.handleChange} errorText={ this.state.errors.password } />
              </div>
            <div className="field-line">
              <TextField floatingLabelText="Email" name="email" onChange={this.handleChange} value={this.state.email} errorText={ this.state.errors.email }/>
            </div>
            <div className="field-line">
              <TextField floatingLabelText="Location" name="location" onChange={this.handleChange} value={this.state.location} errorText={ this.state.errors.location }/>
            </div>
            <div className="field-line">
              <TextField floatingLabelText="ImageUrl" name="profileUrl" onChange={this.handleChange} value={this.state.profileUrl} errorText={ this.state.errors.profileUrl }/>
            </div>
            <div className="field-line">
              <TextField name="description" hintText="Describe yourself or your home to others" multiLine={true} rows={1} rowsMax={4} fullWidth={true} errorText={ this.state.errors.description}/>
            </div>
            <RaisedButton type="submit" label="Submit" primary={true} fullWidth={true} />
          </form>
        </Card>
      </div>
    )
  }
}

module.exports = SignupForm;