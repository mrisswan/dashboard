import React from "react";
import axios from "axios";
import { Route } from "react-router-dom";
// import { withRouter } from "react-router";

export default class Login extends React.Component {
  constructor() {
    super();
    this.state = {
      username: "",
      password: "",
      role: "",
      message: "",
      logged: true,
    };
  }

  bind = (event) => {
    this.setState({ [event.target.name]: event.target.value });
  };

  Login = (event) => {
    event.preventDefault();
    let sendData = {
      username: this.state.username,
      password: this.state.password,
      role: this.state.role,
    };

    let url = "http://localhost:4040/cafe/user/login";

    axios
      .post(url, sendData)
      .then((response) => {
        this.setState({ logged: response.data.logged });
        if (this.state.logged) {
          let user = response.data.data;
          let token = response.data.token;
          localStorage.setItem("user", JSON.stringify(user));
          localStorage.setItem("token", token);
          this.state.role = user.role;
          switch (this.state.role) {
            case "admin":
              window.location = "/admin/dashboard";
              break;
            case "manajer":
              window.location = "/manajer/dashboard";
              break;
            case "kasir":
              window.location = "/kasir/dashboard";
              break;
            default:
              break;
          }
        } else {
          this.setState({ message: response.data.message });
        }
      })
      .catch((error) => console.log(error));
  };

  render() {
    return (
      <div className="relative flex flex-col justify-center min-h-screen overflow-hidden">
        <div className="w-full p-6 m-auto bg-white rounded-md shadow-xl lg:max-w-xl">
          <h1 className="text-3xl font-semibold text-center text-purple-700 uppercase">
            Sign in
          </h1>
          {!this.state.logged ? (
            <div className="alert alert-danger mt-1">
              Invalid Username or password
            </div>
          ) : null}
          <form onSubmit={(ev) => this.Login(ev)} className="mt-6">
            <div className="mb-2">
              <label className="block text-sm font-semibold text-gray-800">
                Username
              </label>
              <input
                type="text"
                name="username"
                value={this.state.username}
                onChange={this.bind}
                className="block w-full px-4 py-2 mt-2 text-purple-700 bg-white border rounded-md focus:border-purple-400 focus:ring-purple-300 focus:outline-none focus:ring focus:ring-opacity-40"
              />
            </div>
            <div className="mb-2">
              <label className="block text-sm font-semibold text-gray-800">
                Password
              </label>
              <input
                type="password"
                name="password"
                className="block w-full px-4 py-2 mt-2 text-purple-700 bg-white border rounded-md focus:border-purple-400 focus:ring-purple-300 focus:outline-none focus:ring focus:ring-opacity-40"
                value={this.state.password}
                onChange={this.bind}
                autoComplete="false"
              />
            </div>
            <div className="mt-6">
              <button
                type="submit"
                className="w-full px-4 py-2 tracking-wide text-white transition-colors duration-200 transform bg-purple-700 rounded-md hover:bg-purple-600 focus:outline-none focus:bg-purple-600"
              >
                Login
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }
}
