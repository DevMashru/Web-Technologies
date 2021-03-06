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
                fetch("https://apiforproj.hforms.me/changepwd", {
                    method: 'PUT',
                    mode: 'cors',
                    credentials: 'include',
                    body: requery
                })
                    .then((response) => {
                        window.location.href = "https://fgkekkthnxbai.hforms.me"
            })
            }
        }
    }
    render(){
        return(
            <div id = "changepwd" className = "component">
                <form>
                    <input type="password" name="oldpassword" onChange = {this.changeHandler} placeholder = "Enter your existing password" required/><br/>
                    <input type="password" name="newpassword" onChange = {this.changeHandler} placeholder = "Enter your new password" required/><br/>
                    <input type="password" name="confnewpassword" onChange = {this.changeHandler} placeholder = "Enter your new password again" required/><br/>
                    <button type="submit" onClick = {this.submitHandler}>Submit</button>
                </form>
            </div>
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
            fetch("https://apiforproj.hforms.me/delacc", {
                method: 'DELETE',
                mode: 'cors',
                credentials: 'include',
                body: requery
            })
                .then((response) => {
                    window.location.href = "https://fgkekkthnxbai.hforms.me/"
                })
        }
    }
    render(){
        return(
            <div id = "delacc" className = "component">
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
            <div className = "component" id = "account">
                <h1 id = "username">{this.props.username}</h1>
                <img src="./user.png" height="200px" width = "200px" alt="User Profile Pic"></img><br/>
                <button type = "button" onClick = {this.logoutHandler}>Logout</button><br/>
                <Router className = "router">
                    <Link to='/account/changepwd' id="changepwd" className="link">Change Password</Link><br/>
                    <Route  path = '/account/changepwd' component = {() => {return <ChangePwd username={this.props.username} />}}></Route>
                </Router>
                <Router className = "router">
                    <Link to='/account/delacc' id="delacc" className="link">Delete Account</Link><br/>
                    <Route exact path = '/account/delacc' component = {() => {return <DeleteAccount username={this.props.username} />}}></Route>
                </Router>
            </div>
        )
    }
}

export default Account;