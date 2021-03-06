import React from 'react';
import { Link, Redirect } from 'react-router-dom';
import $ from 'jquery';
import Navbar from './navbar.jsx';
import { TextField, RaisedButton } from 'material-ui';

class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      errors: {},
      username: '',
      password: '',
      redirectToProfile: false,
      user: {}
    };
    this.handleClick = this.handleClick.bind(this);
    this.onChange = this.onChange.bind(this);
  }

  componentDidMount() {
    if (this.props.location.state) {
      this.setState({
        redirectToProfile: true,
        user: this.props.location.state.user
      });
    }
  }

  login(userData) {
    this.setState({
      redirectToProfile: true,
      user: userData
    });
  }

  onChange (e) {
    let target = e.target.name;
    this.setState ({
      [ target ]: e.target.value,
      errors: {}
    })
  }

  handleClick (e) {
    console.log('login submitted', e.target.value);
    e.preventDefault();
    $.ajax({
      type: 'POST',
      url: '/login',
      data: {
        username: this.state.username,
        password: this.state.password
      },
      success: (data) => {
        console.log(data)
        if (data.errors) {
          this.setState({
            errors: data.errors
          });
        } else {
          this.login(data[0]);
        }
      },
      error: (data) => {
        console.log('error posting data', data);
        this.setState({
          errors: { password: data.responseText }
        });
      }
    });

    this.setState({
      username: '',
      password: ''
    });
  }

  render () {
    const redirectToProfile = this.state.redirectToProfile;
    if (redirectToProfile) {
      if (this.state.user.type === 'host') {
        return(<Redirect to={{ pathname: '/host-profile', state: this.state.user }}/>)
      } else {
        return (<Redirect to={{ pathname: '/listings', state: this.state.user }}/>)
      }
    }
    return (
      <div>
        <Navbar link="Sign Up" linkurl="/signup"/>
        <div className="row">
          <div className="col-md-5">
            <img src='http://www.freepngimg.com/download/dog/15-dog-png-image-picture-download-dogs.png'/>
          </div>
          <div className="col-md-7">
            <form onSubmit={this.handleClick}>
              <h2 className="form-signin-heading">Login</h2>
              <div className="field-line">
                <TextField floatingLabelText="Username" name="username" value={this.state.username} onChange={this.onChange} errorText={ this.state.errors.username }/>
              </div>
              <div className="field-line">
                <TextField floatingLabelText="Password" name="password" type="password" value={this.state.password} onChange={this.onChange} errorText={ this.state.errors.password }/>
              </div>
              <div className="field-line">
                <RaisedButton type="submit" label="Login" primary={true} />
                <br/>
                <Link to="/signup">Don't have an account?</Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    )
  }
}

module.exports = Login;