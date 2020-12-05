import React from 'react';
import {BrowserRouter as Router, Route, Link} from "react-router-dom";

class ChangePwd extends React.Component{
    constructor(props){
        super(props)
        this.state = {
            oldpassword: '',
            newpassword: '',
            confnewpassword: ''
        }
    }
    changeHandler = (ev) => {
        let name = ev.target.name
        let val = ev.target.value
        this.setState({[name]: val})
    }
    submitHandler = (ev) => {
        ev.preventDefault()
        if(this.state.newpassword !== this.state.confnewpassword){
            window.alert("Entered passwords don't match")
        }
        else{
            var c = window.confirm("Are you sure you want to change your password?");
            if(c){
                var requery = 'username=' + this.props.username + '&oldpassword=' + this.state.oldpassword + '&newpassword=' + this.state.newpassword
                console.log("sending request")
                fetch("http://localhost:8080/changepwd", {
                    method: 'PUT',
                    mode: 'cors',
                    credentials: 'include',
                    body: requery
                })
                    .then((response) => {
                        console.log("in put.then")
                        console.log(response.body)
                    })
            }
        }
    }
    render(){
        return(
            <form>
                <input type="password" name="oldpassword" onChange = {this.changeHandler} placeholder = "Enter your existing password" /><br/>
                <input type="password" name="newpassword" onChange = {this.changeHandler} placeholder = "Enter your new password" /><br/>
                <input type="password" name="confnewpassword" onChange = {this.changeHandler} placeholder = "Enter your new password again" /><br/>
                <button type="submit" onClick = {this.submitHandler}>Submit</button>
            </form>
        )
    }
}

class DeleteAccount extends React.Component{
    constructor(props){
        super(props)
    }
    submitHandler = (ev) => {
        var c = window.confirm("Are you sure you want to delete your account?")
        if(c){
            var requery = 'username=' + this.props.username
            fetch("http://localhost:8080/delacc", {
                method: 'DELETE',
                mode: 'cors',
                credentials: 'include',
                body: requery
            })
                .then((response) => {
                    console.log("in delete.then")
                    console.log(response)
                    window.location.href = "http://localhost:3000/"
                })
        }
    }
    render(){
        return(
            <div>
                <button type="button" onClick = {this.submitHandler}>Confirm</button><br/>
            </div>
        )
    }
}

class Account extends React.Component{
    constructor(props){
        super(props);
    }
    logoutHandler = (ev) => {
        var c = window.confirm("Are you sure you want to logout?")
        if(c){
            this.props.onLogout();
        }
    }
    render(){
        return(
            <div className = "App">
                <h1 id = "username">Username</h1>
                <img src="./user.png" height="200px" width = "200px" alt="User Profile Pic"></img><br/>
                <Router className = "router">
                    <Link to='/account/changepwd' id="changepwd" className="link">Change Password</Link><br/>
                    <Route  path = '/account/changepwd' component = {() => {return <ChangePwd username={this.props.username} />}}></Route>
                </Router>
                <Router className = "router">
                    <Link to='/account/delacc' id="delacc" className="link">Delete Account</Link><br/>
                    <Route exact path = '/account/delacc' component = {() => {return <DeleteAccount username={this.props.username} />}}></Route>
                </Router>
                <button type = "button" onClick = {this.logoutHandler}>Logout</button>
            </div>
        )
    }
}

export default Account;