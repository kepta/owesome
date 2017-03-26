import React from 'react';
export default class ProgressIndicator extends React.Component {
    constructor() {
        super();
        this.state = {
            loaded: 0,
            total: 0
        }
        this.timestamp = Date.now();
        this.diff = 15;
        this.oscstarted = (n) => {
            this.setState({
                loaded: 0,
                total: n.detail
            });
        }
        this.oscloaded = (n) => {
            this.setState({
                loaded: 0,
                total: 0
            });
        }
        this.oscpageload = (n) => {
            const currentTime = Date.now();
            this.diff = 0.98 * (this.diff) + 0.02 * (currentTime - this.timestamp);
            this.timestamp = currentTime;
            this.setState({
                loaded: this.state.loaded + 1,
            });
        }
        document.body.addEventListener('oscstarted', this.oscstarted);
        document.body.addEventListener('oscloaded', this.oscloaded);
        document.body.addEventListener('oscpageload', this.oscpageload);
    }
    componentWillUnmount() {
        document.body.removeEventListener('oscpageload', this.oscpageload);
        document.body.removeEventListener('oscstarted', this.oscstarted);
        document.body.removeEventListener('oscloaded', this.oscloaded);
    }
    render() {
        return this.state.total ?
            <div>
                <span> Loading {this.state.loaded}/{this.state.total} </span>
                <span> {parseInt((this.state.total - this.state.loaded) * (this.diff / 1000), 10)} seconds left</span>
                <span> {this.state.loaded % 3 === 0 ? '.' : this.state.loaded % 3 === 1 ? '..' : '...'}</span>
            </div>
            : null
    }
}
