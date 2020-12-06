import React from 'react';

class Items extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            name: '',
            alink: '',
            flink: '',
            minimum: 0
        }
    }
    handleChange = (ev) => {
        var field = ev.target.name
        var val = ev.target.value
        this.setState({[field]: val})
    }
    handleSubmit = (ev) => {
        ev.preventDefault();
        var requery = 'name=' + this.state.name + '&alink=' + this.state.alink + '&flink=' + this.state.flink + '&minimum=' + this.state.minimum
        fetch("https://apiforproj.hforms.me/api/add", {
            method: 'POST',
            mode: 'cors',
            credentials: 'include',
            body: requery
        })
            .then((response) => {
                window.alert("Item added")
            })
    }
    render(){
        return(
            <div  id = "items" className = "component">
                <h1>Items</h1>
                <form onSubmit = {this.handleSubmit}>
                    <input type="textarea" name="name" onChange = {this.handleChange} placeholder = "Enter the item name"></input><br/>
                    <input type="textarea" name="alink" onChange = {this.handleChange} placeholder = "Enter the Amazon link"></input><br/>
                    <input type="textarea" name="flink" onChange = {this.handleChange} placeholder = "Enter the Flipkart link"></input><br/>
                    <input type="number" name="minimum" onChange = {this.handleChange} placeholder = "Enter the minimum price to get notified"></input><br/>
                    <button type = "submit">Submit</button>
                </form>
            </div>
        )
    }
}

export default Items;