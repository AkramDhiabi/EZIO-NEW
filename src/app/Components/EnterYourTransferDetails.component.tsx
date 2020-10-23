import * as React from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import DayPickerInput from 'react-day-picker/DayPickerInput';
import 'react-day-picker/lib/style.css';
import {
    Divider,
    Icon,
    Message,
    Table,
    Dropdown,
} from "semantic-ui-react";
import { bindActionCreators } from "redux";
import dateFnsFormat from 'date-fns/format';
import dateFnsParse from 'date-fns/parse';
import { DateUtils } from 'react-day-picker';

import { FormBuilder, FieldControl, FieldGroup } from "react-reactive-form";
import {
    setcurrenttokenstep,
    setload,
} from "../Actions/action";

import { ToastDanger } from "react-toastr-basic";

class EnterYourTransferDetails extends React.Component<any, any> {
    constructor(props) {
        super(props);
        this.handletransfersubmit = this.handletransfersubmit.bind(this);
        this.keyPressed = this.keyPressed.bind(this);
        this.state = {
            fromAcc: this.fromAccOptions[0].value,
            toAcc: 'SE1234567890123456789012',
            amount: '1250,00',
            errormessage: false,
            startDate: new Date(),
            dateSelected: dateFnsFormat(new Date(), 'MM/dd/yyyy'),
            validDate: true,
        };
    }


    fromAccOptions = [
        { key: '1', text: "Personal account - 3719 90 20030 - €1.994,00", value: "Personal account - 3719 90 20030 - €1.994,00" },
        { key: '2', text: "Savings account - 8989 89 48119 - €32.453,45", value: "Savings account - 8989 89 48119 - €32.453,45" }
    ]

    componentWillMount() {
        this.props.setload(false);
    }
    
    keyPressed(event) {
        if (event.key === "Enter") { 
            this.handletransfersubmit(null);
        }
    }

    handletransfersubmit(e: React.MouseEvent<HTMLButtonElement>) {
        if(e){e.preventDefault();}
        this.setState({
            errormessage: false,
        });

        this.tokenform.value.fromAcc = this.state.fromAcc;
        this.tokenform.value.toAcc = this.state.toAcc;
        this.tokenform.value.amount = this.state.amount;
        this.tokenform.value.date = this.state.startDate; 

        if (
            this.tokenform.value.fromAcc !== "" &&
            this.tokenform.value.toAcc !== "" &&
            this.tokenform.value.amount !== "" &&
            this.tokenform.value.date !== "" &&
            parseInt(this.tokenform.value.amount) <= 100000 &&
            parseInt(this.tokenform.value.amount) !== 0 &&
            this.state.validDate == true
        ) {
            var setTokendetails = {
                currenttokenstep: 3,
                transferDetail: this.tokenform.value,
            };
            this.props.setcurrenttokenstep(setTokendetails);
        } else {
            if (
                this.tokenform.value.fromAcc == "" ||
                this.tokenform.value.toAcc == "" ||
                this.tokenform.value.amount == "" ||
                this.tokenform.value.date == ""
            ) {
                ToastDanger("Error. (*) fields are required");
            } else if (this.state.validDate == false) {
                ToastDanger("Invalid date format");
            } else if (
                parseInt(this.tokenform.value.amount) > 100000 ||
                parseInt(this.tokenform.value.amount) === 0
            ) {
                this.setState({
                    errormessage: true,
                });
            }
        }
    }

    tokenform = FormBuilder.group({
        fromAcc: "Personal account - 3719 90 20030 - €1.994,00",
        toAcc: "",
        amount: "",
        currency: "EUR",
        date: "",
    });

    handlemtcancel(e) {
        e.preventDefault();
        this.props.history.push("/layout/accountsummary");
    }

    handleKeyPressnumber = (event) => {
        var charCode = event.charCode;
        if (charCode > 31 && (charCode < 48 || charCode > 57) && charCode != 44) {
            event.preventDefault();
        }
    };

    handleKeyPressLetterUpperCase = (e) => {
        e.target.value = e.target.value.toUpperCase();
    };

    handleChange = (e, { name, value }) => {
        this.tokenform.value.fromAcc = value;
     
        this.setState({ 
           fromAcc: value, 
        });
    }

    handleToAccChange = (e) => {
        let value = e.target.value;
        this.setState({ toAcc: value })
    }

    handleAmountChange = (e) => {
        let value = e.target.value;
        this.setState({ amount: value })
    }

    handleDateChange = (day) => {
        if (this.isDate(day)) {
            this.tokenform.value.date = day;
            this.setState({
                startDate: new Date(day),
                dateSelected: dateFnsFormat(new Date(day), 'MM/dd/yyyy'),
                validDate: true
            });
        } else {
            this.setState({ validDate: false });
        }
    }

    isDate = (value) => {
        if (toString.call(value) === '[object Date]') {
            return true;
        } else {
            return false;
        }
    }


    render() {
        return (
            <div>
                {this.state.errormessage === true && (
                    <Message negative>
                        <div className="twarning">
                            <Icon color="red" name="warning sign" />{" "}
                        </div>
                        <div>
                            <Message.Header>Invalid transfer details!</Message.Header>
                            <p>Overdraft not authorized</p>
                        </div>
                    </Message>
                )}

                <span className="addfontsize"><span className="font-weight-bold">Step 2</span> of 4: Enter your transfer details</span>
                <span className="mtrequirelabel">
                    <label className="star">*</label>indicates a required field
        </span>
                <div className="tmplbrdrcls addmargin"></div>

                <FieldGroup
                    control={this.tokenform}
                    render={({ pristine, value }) => (
                        <form
                            className="etform tokenform"
                            onSubmit={() => this.handletransfersubmit}
                        >
                            <Table className="rttable " singleLine basic="very" unstackable>
                                <Table.Body>
                                    <Table.Row>
                                        <Table.Cell width={3}>
                                            <label className="pwdusr">
                                                From account<label className="star">*</label>
                                            </label>
                                        </Table.Cell>
                                        <Table.Cell>
                                            <FieldControl
                                                name="fromAcc"
                                                render={({ handler }) => (
                                                    <div>
                                                        <Dropdown
                                                            selection
                                                            name="fromAcc" 
                                                            defaultValue={this.tokenform.value.fromAcc}
                                                            onChange={this.handleChange}
                                                            options={this.fromAccOptions}
                                                        />
                                                    </div>
                                                )}
                                            />
                                        </Table.Cell>
                                    </Table.Row>
                                    <Table.Row>
                                        <Table.Cell>
                                            <label className="pwdusr">
                                                Reciever IBAN account number
                                            <label className="star">*</label>
                                            </label>
                                        </Table.Cell>
                                        <Table.Cell>
                                            <FieldControl
                                                name="toAcc"
                                                render={({ handler }) => (
                                                    <div>
                                                        <input
                                                            {...handler()}
                                                            maxLength={24}
                                                            autoFocus
                                                            value={this.state.toAcc}
                                                            onInput={this.handleToAccChange}
                                                            onKeyDown={this.keyPressed}
                                                            onKeyPress={this.handleKeyPressLetterUpperCase}
                                                        />
                                                    </div>
                                                )}
                                            />
                                        </Table.Cell>
                                    </Table.Row>
                                    <Table.Row>
                                        <Table.Cell>
                                            <label className="pwdusr">
                                                Amount (EUR)<label className="star">*</label>
                                            </label>
                                        </Table.Cell>
                                        <Table.Cell>
                                            <FieldControl
                                                name="amount"
                                                render={({ handler }) => (
                                                    <div>
                                                        <input
                                                            {...handler()}
                                                            value={this.state.amount}
                                                            onInput={this.handleAmountChange}
                                                            onKeyPress={this.handleKeyPressnumber}
                                                            onKeyDown={this.keyPressed}
                                                        />
                                                    </div>
                                                )}
                                            />
                                        </Table.Cell>
                                    </Table.Row>
                                    <Table.Row>
                                        <Table.Cell>
                                            <label className="pwdusr">
                                                Date<label className="star">*</label>
                                            </label>
                                        </Table.Cell>
                                        <Table.Cell>
                                            <DayPickerInput
                                                formatDate={formatDate}
                                                onDayChange={this.handleDateChange}
                                                format='MM/dd/yyyy'
                                                parseDate={parseDate}
                                                value={this.state.dateSelected} 
                                            />
                                        </Table.Cell>
                                    </Table.Row>
                                </Table.Body>
                            </Table>
                        </form>
                    )}
                />

                <div>
                    <Divider />
                    <button
                        className="ui grey button"
                        onClick={(e) => this.handlemtcancel(e)}
                    >
                        {" "}
            Cancel
          </button>
                    <button
                        className="ui blue button btnrightal"
                        onClick={(e) => this.handletransfersubmit(e)}
                    >
                        {" "}
            Continue
          </button>
                </div>
            </div>
        );
    }
}

function parseDate(str, format, locale) {
    const parsed = dateFnsParse(str, format, new Date(), { locale });
    if (DateUtils.isDate(parsed)) {
        return parsed;
    }
    return undefined;
}

function formatDate(date, format, locale) {
    return dateFnsFormat(date, format, { locale });
}

function mapStateToProps(state) {
    return {};
}
function matchDispatchToProps(dispatch) {
    return bindActionCreators(
        {
            setcurrenttokenstep: setcurrenttokenstep,
            setload: setload,
        },
        dispatch
    );
}

export default withRouter(
    connect(mapStateToProps, matchDispatchToProps)(EnterYourTransferDetails)
);
