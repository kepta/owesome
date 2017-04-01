import React from 'react';
import ProgressIndicator from './ProgressIndicator';
import { DateRangePicker } from 'react-dates';
import moment from 'moment';
import R from 'ramda';
class Navbar extends React.Component {
    static defaultProps = {
        variables: {}
    }
    constructor(props) {
        super(props);
        this.state ={
            focusedInput: null
        }
    }
    onFocusChange = (focusedInput) => {
        this.setState({ focusedInput });
    };
    render() {
        const { variables, handleChangeDate, advanced, jsonLiteHandler } = this.props;
        let dateFrom = moment(variables.dateFrom).isValid() ? moment(variables.dateFrom) : null;
        let dateTo = moment(variables.dateTo).isValid() ? moment(variables.dateTo) : null;
        return (
            <nav className="pt-navbar .modifier">
                <div className="pt-navbar-group pt-align-left">
                    &nbsp;
                &nbsp;
                &nbsp;
                <div className="pt-navbar-heading">Owesome</div>
                    <ProgressIndicator />
                </div>
                <div className="pt-navbar-group pt-align-right">
                    <DateRangePicker
                        startDate={dateFrom}
                        endDate={dateTo}
                        isOutsideRange={(x) => !x.isBefore(moment())}
                        onDatesChange={handleChangeDate} // PropTypes.func.isRequired,
                        focusedInput={this.state.focusedInput} // PropTypes.oneOf([START_DATE, END_DATE]) or null,
                        onFocusChange={this.onFocusChange} // PropTypes.func.isRequired,
                    />
                    <span className="pt-navbar-divider"></span>
                    <button className={`pt-button ${advanced ? `pt-active` : ''} pt-minimal pt-icon-predictive-analysis`} onClick={jsonLiteHandler}></button>
                </div>
            </nav>
        );
    }
}


export default Navbar;