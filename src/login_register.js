import React from 'react';
import {BrowserRouter as Router, Route, Link} from "react-router-dom";

class Login extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            username: '',
            password: ''
        }
    }
    onChangeHandler = (ev) => {
        let field = ev.target.name;
        let value = ev.target.value;
        this.setState({[field]: value});
    }
    onSubmitHandler = (ev) => {
        ev.preventDefault();
        var requery = "username=" + this.state.username + '&password=' + this.state.password
        fetch("https://apiforproj.hforms.me/login", {
            method: 'POST',
            mode: 'cors',
            credentials: 'include',
            body: requery
        })
            .then((response) => response.json())
                .then((data) => {
                    if(data.msg === 'username not found')
                        window.alert("Username not found")
                    else if(data.msg === 'wrong password')
                        window.alert("Incorrect password")
                    else{
                        window.alert("Logged in");
                        this.props.onLogin(this.username)
                    }
                })
    }
    render(){
        return(
            <div>
                <form onSubmit={this.onSubmitHandler}>
                    <input type = "text" name = "username" onChange = {this.onChangeHandler} placeholder = "Enter your username" required/><br/>
                    <input type = "password" name = "password" onChange = {this.onChangeHandler} placeholder = "Enter your password" required/><br/>
                    <button type = "submit">Submit</button>
                </form>
            </div>
        );
    }
}

class Register extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            username: '',
            password: '',
            email: '',
            next: 0
        }
    }
    onChangeHandler = (ev) => {
        let field = ev.target.name;
        let value = ev.target.value;
        this.setState({[field]: value});
    }
    onClickHandler = (ev) => {
        this.setState({next: 0})
    }
    onSubmitHandler = (ev) => {
        ev.preventDefault();
        if(this.state.next === 0){
            this.setState({next: 1});
            return;
        }
        var requery = 'username=' + this.state.username + '&password=' + this.state.password + '&email=' + this.state.email
        var options = {
            method: 'POST',
            mode: 'cors',
            credentials: 'include',
            body: requery
        }
        fetch("https://apiforproj.hforms.me/register", options)
            .then((response) => {
                if(response.status === 200){
                    window.alert("Registered")
                    this.props.onRegister(this.username)
                }
                else if(response.status === 404)
                    window.alert("Username already taken")
            })
    }
    email = (ev) => {
        this.setState({email: ev.target.value})
    }
    render(){
        if(this.state.next === 0){
            return(
                <div>
                    <form onSubmit={this.onSubmitHandler}>
                        <input type = "text" name = "username" onChange = {this.onChangeHandler} placeholder = "Enter your username" value = {this.state.username} required/><br/>
                        <input type = "password" name = "password" onChange = {this.onChangeHandler} placeholder = "Enter your password" required/><br/>
                        <input type = "password" name = "confpassword" onChange = {this.onChangeHandler} placeholder = "Enter your password again" required/><br/>
                        <button type = "submit">Next</button>
                    </form>
                </div>
            );
        }
        else{
            return(
                <div>
                    <form onSubmit={this.onSubmitHandler}>
                        <input type = "email" onChange = {this.email} placeholder = "Enter email id (optional)" value = {this.state.email}/><br/>
                        <button type = "button" onClick = {this.onClickHandler}>Back</button>
                        <button type = "submit">Submit</button>
                    </form>
                </div>
            )
        }
    }
}

class LoginRegister extends React.Component{
    constructor(props){
        super(props)
    }
    handleLogin = (username) => {
        this.props.onLoginRegister(username)
    }
    handleRegister = (username) => {
        this.props.onLoginRegister(username)
    }
    render(){
        return(
            <div id = "login_register" className = "component">
                <Router>
                    <Link to = "/login" id="login" className="link">Login</Link>
                    <Link to = "/register" id="register" className="link">Register</Link>
                    <Route exact path = "/login" component = {() => { return <Login onLogin = {this.handleLogin} /> }}></Route>
                    <Route exact path = "/register" component = {() => { return <Register onRegister = {this.handleRegister} /> }}></Route>
                </Router>
            </div>
        )
    }
}

export default LoginRegister;