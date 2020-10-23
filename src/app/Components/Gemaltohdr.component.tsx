import * as React from 'react';
// import { connect } from 'react-redux';
// import { store } from '../Store/store';
// import { Provider } from 'react-redux';
// import { Link } from 'react-router-dom';
import { Grid, Container, Segment } from 'semantic-ui-react';
import 'semantic-ui-css/semantic.min.css';


const loginlogo = require('../../img/demologo.png');

class Gemaltoheader extends React.Component<any, any>{
    render() {
        return (
       
                <Grid columns={2} stackable>
                    <Grid.Column width={12}>
                        <Segment className="divstylcss">
                            <img className="logoimage" src={loginlogo} alt="Gemalto" />
                        </Segment>
                    </Grid.Column>
                    <Grid.Column width={4}>
                        <Segment className="divstylcss">
                            {/* <span className="titletext">Demo mobile demo</span> */}
                        </Segment>
                    </Grid.Column>
                </Grid>

          

        )
    }
}


export default Gemaltoheader;