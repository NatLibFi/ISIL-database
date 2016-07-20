const React = require('react');
const ReactDOM = require('react-dom');

class Application extends React.Component {
  constructor() {
    super();
    this.state = {
      state: "initial"
    };
    this.handleClick = this.handleClick.bind(this.handleClick);
  }
  handleClick() {
    this.setState({state: "clicked"});
  }
  render() {
    alert(this.state.state);
    return (
      <div>
        <div className="centeredDiv">
          <Button type ="btn btn-success" onClick={this.handleClick.bind(this)} />
          <Button type ="btn btn-primary" />
          <Button type ="btn btn-warning" />
        </div>
        <div className="centeredDiv">
         {this.state.state}
        </div>
      </div>
    );
  }
}

class Button extends React.Component {
  constructor() {
    super();
    this.state = {
      liked: false 
    };
    //this.handleClick = this.handleClick.bind(this);
  }
  //handleClick() {
  //  this.setState({liked: !this.state.liked});
  //}
  render() {
    const text = this.state.liked ? 'Kiitos klikistä' : 'Klikkaa!';
    return (
      <button className={this.props.type} >
        {text}
      </button>
    );
  }
}

ReactDOM.render(
  <Application />,
  document.getElementById('admin-app')
);
