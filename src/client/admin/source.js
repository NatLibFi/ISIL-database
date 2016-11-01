const React = require('react');
const ReactDOM = require('react-dom');

class Application extends React.Component {
  constructor() {
    super();
    this.state = {
      alternatives: ["foo", "far"],
      liked: "initial"
    };
    this.handleClick = this.handleClick.bind(this);
  }
  handleClick() {
    let index = this.state.alternatives.indexOf(this.state.liked);
    let value = this.state.alternatives[index + 1];
    this.setState({liked: value});
  }
  render() {
    return (
      <div>
        <div className="centeredDiv">
          <Button type ="btn btn-success" name="Moi" onClick={this.handleClick} />
          <Button type ="btn btn-primary" name="Merci" />
          <Button type ="btn btn-warning" name="HÄ?" />
        </div>
        <div className="alert alert-success" role="alert">
         {this.state.liked}
        </div>
      </div>
    );
  }
}

class Button extends React.Component {
  render() {
    return (
      <button className={this.props.type} onClick={this.props.onClick} >
        {this.props.name}
      </button>
    );
  }
}

ReactDOM.render(
  <Application />,
  document.getElementById('admin-app')
);
