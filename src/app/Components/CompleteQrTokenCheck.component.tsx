import * as React from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { Divider } from "semantic-ui-react";
import { bindActionCreators } from "redux";
 
import { setload } from "../Actions/action";
 

class CompleteQrTokenCheck extends React.Component<any, any> {
    constructor(props) {
        super(props);
    }

    componentWillMount() {
        this.props.setload(false);
    }

    handletokensubmit(e: React.MouseEvent<HTMLButtonElement>) {
        e.preventDefault();
        this.setState({
            errormessage: false,
        });
    }

    render() {
        return (
            <div>
                <span className="addfontsize"><span className="font-weight-bold">Step 4</span> of 4: Complete </span>
                <span className="mtrequirelabel">
                    <label className="star">*</label>indicates a required field
                </span>
                <div className="tokenform">
                <div className="successMessage">Transaction successfully signed!</div>
                <div>
                    <Divider />
                </div>
                </div>
            </div>
        );
    }
}

function mapStateToProps(state) {
    return {};
}
function matchDispatchToProps(dispatch) {
    return bindActionCreators(
        {
            setload: setload,
        },
        dispatch
    );
}

export default withRouter(
    connect(mapStateToProps, matchDispatchToProps)(CompleteQrTokenCheck)
);
