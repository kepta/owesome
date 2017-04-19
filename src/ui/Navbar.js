import React from 'react';
import ProgressIndicator from './ProgressIndicator';
import { DateRangePicker } from 'react-dates';
import moment from 'moment';
import { Button, Tooltip, Position } from '@blueprintjs/core';
class Navbar extends React.PureComponent {
    static defaultProps = {
        variables: {}
    };
    constructor(props) {
        super(props);
        this.state = {
            focusedInput: null
        };
    }
    onFocusChange = focusedInput => {
        this.setState({ focusedInput });
    };
    render() {
        const {
            variables,
            handleChangeDate,
            advanced,
            jsonLiteHandler,
            downloadJSON
        } = this.props;
        const currentMoment = moment();

        let dateFrom = moment(variables.dateFrom).isValid()
            ? moment(variables.dateFrom)
            : null;
        let dateTo = moment(variables.dateTo).isValid()
            ? moment(variables.dateTo)
            : null;

        return (
            <nav className="pt-navbar .modifier">
                <div className="pt-navbar-group pt-align-left">
                    &nbsp;
                    &nbsp;
                    &nbsp;
                    <div className="pt-navbar-heading">Owesome</div>
                    <div className="pt-button-group .modifier">
                        <Tooltip
                            content="Prettify Query!"
                            position={Position.RIGHT}
                            hoverOpenDelay={500}
                        >
                            <Button
                                iconName="code"
                                className="pt-minimal"
                                onClick={this.props.prettify}
                            />
                        </Tooltip>
                        <Tooltip
                            content="Run Query!"
                            position={Position.RIGHT}
                            hoverOpenDelay={500}
                        >
                            <Button
                                loading={this.props.pagesLoaded}
                                iconName="play"
                                className="pt-minimal"
                                onClick={this.props.runQuery}
                            />
                        </Tooltip>
                    </div>
                    <ProgressIndicator />
                </div>
                <div className="pt-navbar-group pt-align-right">
                    <DateRangePicker
                        startDate={dateFrom}
                        endDate={dateTo}
                        isOutsideRange={x => !x.isBefore(currentMoment)}
                        onDatesChange={handleChangeDate} // PropTypes.func.isRequired,
                        focusedInput={this.state.focusedInput} // PropTypes.oneOf([START_DATE, END_DATE]) or null,
                        onFocusChange={this.onFocusChange} // PropTypes.func.isRequired,
                    />
                    <span className="pt-navbar-divider" />
                    <button
                        className={
                            `pt-button ${advanced ? `pt-active` : ''} pt-minimal pt-icon-predictive-analysis`
                        }
                        onClick={jsonLiteHandler}
                    />
                    <button
                        className={`pt-button pt-minimal pt-icon-download`}
                        onClick={downloadJSON}
                    />
                </div>
            </nav>
        );
    }
}

export default Navbar;
