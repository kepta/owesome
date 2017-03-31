import React from 'react';
import ProgressIndicator from './ProgressIndicator';
import { DateRangePicker } from 'react-dates';
import moment from 'moment';
import R from 'ramda';
export default function ({ variables, handleChangeDate, focusedInput, onFocusChange, advanced, jsonLiteHandler}) {
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
                <span className="pt-navbar-divider"></span>
                <button className={`pt-button ${advanced ? `pt-active` : ''} pt-minimal pt-icon-predictive-analysis`} onClick={jsonLiteHandler}></button>
            </div>
        </nav>
    );
}