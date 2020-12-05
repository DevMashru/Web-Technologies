import React from 'react'

function Fetch(){
	var d = []
	return fetch('http://localhost:8080/api/top', {
		method: 'POST',
		mode: 'cors',
		credentials: 'include'
	}).then((response) => response.json());
}
class Top1 extends React.Component {
	constructor(props){
		super(props);
		this.state = {
			d : [],
			li: [],
		};
	}

	componentDidMount(){
		Fetch()
		.then((d) => {
			this.setState({ d:d })
			var li;
			var name = [], Aprice = [], Fprice = [], lowestprice = [], highestprice = [], Alink = [], Flink = [];
			li = this.state.d.map((d,i)=>{
			for (let i = 0; i < this.state.d.length; i++) {
				name[i] = this.state.d[i].name;
				Aprice[i] = this.state.d[i].Aprice;
				Fprice[i] = this.state.d[i].Fprice;
				lowestprice[i] = this.state.d[i].lowestprice;
				highestprice[i] = this.state.d[i].highestprice;
				Alink[i] = this.state.d[i].Alink;
				Flink[i] = this.state.d[i].Flink;
			}
			if(Alink[i] && Flink[i]){
				return(
					<tr key = {i}>
						<td>{name[i]}</td>
						<td>{Aprice[i]}</td>
						<td>{Fprice[i]}</td>
						<td>{lowestprice[i]}</td>
						<td>{highestprice[i]}</td>
						<td><a target = '_blank' href = {Alink[i]}>link</a></td>
						<td><a target = '_blank' href = {Flink[i]}>link</a></td>
					</tr>
				);
			}
			else if(Alink[i]){
				return(
					<tr key = {i}>
						<td>{name[i]}</td>
						<td>{Aprice[i]}</td>
						<td>{Fprice[i]}</td>
						<td>{lowestprice[i]}</td>
						<td>{highestprice[i]}</td>
						<td><a target = '_blank' href = {Alink[i]}>link</a></td>
						<td>N/A</td>
					</tr>
				);
			}
			else if(Flink[i]){
				return(
					<tr key = {i}>
						<td>{name[i]}</td>
						<td>{Aprice[i]}</td>
						<td>{Fprice[i]}</td>
						<td>{lowestprice[i]}</td>
						<td>{highestprice[i]}</td>
						<td>N/A</td>
						<td><a target = '_blank' href = {Flink[i]}>link</a></td>
					</tr>
				);
			}
		});
		this.setState({ li:li })
		});
	}
	render() {
		return ( 
			<table>
				<tbody>
				<tr>
					<th>Name</th>
					<th>Amazon Price</th>
					<th>Flipkart Price</th>
					<th>Lowest Price since 3/12/'20</th>
					<th>Highest Price since 3/12/'20</th>
					<th>Amazon Link</th>
					<th>Flipkart Link</th>
				</tr>
				</tbody>
				<tbody>{this.state.li}</tbody>
			</table>
		);
	}
}

export default Top1