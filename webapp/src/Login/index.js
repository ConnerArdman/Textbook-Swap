import React, { Component } from "react";
import { withRouter } from "react-router";
import app from "../base";

import LoginView from "./LoginView";

class LoginContainer extends Component {
  handleLogin = async event => {
    event.preventDefault();
    const { email, password } = event.target.elements;
    try {
      await app
        .auth()
        .signInWithEmailAndPassword(email.value, password.value);
      this.props.history.push("/");
    } catch (error) {
      alert(error);
    }
  };

  render() {
    return <LoginView onSubmit={this.handleLogin} />;
  }
}

export default withRouter(LoginContainer);
