import * as React from 'react';
import {Component} from 'react'
import {Link} from 'react-router-dom';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {store} from '../Store/store';
import {setload} from '../Actions/action';
import {
    Accordion,
    Button,
    Container,
    Grid,
    Header,
    Icon,
    Image,
    Item,
    Label,
    Menu,
    Segment,
    Step,
    Table,
    Divider
} from 'semantic-ui-react'
import 'semantic-ui-css/semantic.min.css';

class Loading extends React.Component < any,
any > {
    constructor(props) {
        super(props);
    }

    componentWillMount() {

        this.props.setload(true);
        this.props.history.push(store.getState().currentroute);
 }

    render() {
       return (
            <div>
               
               Loading screen...
              
            </div>
        )
    }
}
function mapStateToProps(state) {
    return {}
}
function matchDispatchToProps(dispatch) {
    return bindActionCreators({
        setload: setload
    }, dispatch)
}
export default connect(mapStateToProps, matchDispatchToProps)(Loading)
