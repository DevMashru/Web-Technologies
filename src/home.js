import React from 'react';
import Top1 from './Top1'

class Home extends React.Component{
	render(){
		return(
			<div id = "home" className = "component">
				<h1>Home</h1>
				<Top1/>
			</div>
		)
	}
}

export default Home;