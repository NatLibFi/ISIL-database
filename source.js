const React = require('react');
const ReactDOM = require('react-dom');
const _ = require('underscore');

//var rootElement =
//  React.createElement('div', {}, 
//    React.createElement('h1', {}, "Jumantzukka"),
//    React.createElement('ul', {},
//      React.createElement('li', {},
//        React.createElement('h2', {}, "James Nelson"),
//        React.createElement('a', {href: 'mailto:james@jamesknelson.com'}, 'james@jamesknelson.com')
//      ),
//      React.createElement('li', {},
//        React.createElement('h2', {}, "Joe Citizen"),
//        React.createElement('a', {href: 'mailto:joe@example.com'}, 'joe@example.com')
//      )
//    )
//  )

var listOfItems = <ul className="list-of-items"> <li className="item-1">Item 1</li> <li className="item-2">Item 2</li> <li className="item-3">Item 3</li> </ul>;
ReactDOM.render(listOfItems, document.getElementById('react-app'));

//ReactDOM.render(React.createElement(HelloMessage, { name: "John" }), document.getElementById('react-app'));

//ReactDOM.render(<HelloMessage2 name="Kake" />, document.getElementById('react-app'));

//ReactDOM.render(<Nappi name="Painapa" />, document.getElementById('react-app'));
