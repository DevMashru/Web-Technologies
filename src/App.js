import React from 'react'
import {BrowserRouter as Router, Route, Link} from "react-router-dom";
import Home from './home'
import AboutUs from './about_us'
import Items from './items'
import LoginRegister from './login_register';
import Account from './account'

class NotFound extends React.Component{
	render(){
		return(
			<h1>404: Not found</h1>
		)
	}
}

class App extends React.Component{
  constructor(props){
	super(props);
	this.state = {
	  username: "none"
	}
  }
  componentDidMount(){
	console.log("ComponentDidMount called")
	fetch("http://localhost:8080/getcookie", {
	  method: 'GET',
	  mode: 'cors',
	  credentials: 'include'
	})
		.then((response) => response.json())
			.then((data) => {
				this.setState({username: data.uname})
			})
	}
  handleLogout = () => {
	console.log('handleLogout() called')
	fetch("http://localhost:8080/logout", {
		method: 'GET',
		mode: 'cors',
		credentials: 'include'
	})
		.then((response) => {
			this.setState({username: "none"})
			window.location.href = "http://localhost:3000"
		})
  }
  handleLoginRegister = (username) =>{
	this.setState({username: username})
	window.location.href = "http://localhost:3000"
  }
  render(){
	if(this.state.username === "none"){
	  return(
		<div id = "app">
		  <header>
			<Router className = "router">
			  <Link to = "/" id="home" className="headerlink" onClick = {this.handleNavClick}>Home</Link>
			  <Link to = "/about_us" id="about_us" className="headerlink" onClick = {this.handleClick}>About Us</Link>
			  <Link to = "/log" id="log" className="headerlink" onClick = {this.handleClick}>Login</Link>
			  <Route exact path = "/" component = {Home}></Route>
			  <Route exact path = "/about_us" component = {AboutUs}></Route>
			  <Route exact path = "/log" component = {() => { return <LoginRegister onLoginRegister = {this.handleLoginRegister}/> }}></Route>
			  <Route exact path = "/items" component = {NotFound}></Route>
			  <Route exact path = "/account" component = {NotFound}></Route>
			</Router>
		  </header>
		</div>
	  )
	}
	else{
	  return(
		<div id = "app">
			<Router className = "router">
				<Link to = "/" id="home" className="headerlink" onClick = {this.handleNavClick}>Home</Link>
				<Link to = "/about_us" id="about_us" className="headerlink" onClick = {this.handleNavClick}>About Us</Link>
				<Link to = "/items" id="items" className="headerlink" onClick = {this.handleNavClick}>Search/View Items</Link>
				<Link to = "/account" id="account" className="headerlink" onClick = {this.handleNavClick}>Account</Link>
				<Route exact path = "/" component = {Home}></Route>
				<Route exact path = "/about_us" component = {AboutUs}></Route>
				<Route exact path = "/items" component = {Items}></Route>
				<Route exact path = "/account" component = {() => { return <Account username = {this.state.username} onLogout = {this.handleLogout}/>}}></Route>
				<Route exact path = "/log" component = {NotFound}></Route>
				<Route exact path = "/login" component = {NotFound}></Route>
				<Route exact path = "/register" component = {NotFound}></Route>
			</Router>
		</div>
	  )
	}
  }
}

export default App;