import React from 'react';
import JSONTree from 'react-json-tree';
import JSONLite from './JSONlite';
const themed = {
    scheme: 'monokai',
    author: 'wimer hazenberg (http://www.monokai.nl)',
    base00: '#272822',
    base01: '#383830',
    base02: '#49483e',
    base03: '#75715e',
    base04: '#a59f85',
    base05: '#f8f8f2',
    base06: '#f5f4f1',
    base07: '#f9f8f5',
    base08: '#f92672',
    base09: '#fd971f',
    base0A: '#f4bf75',
    base0B: '#a6e22e',
    base0C: '#a1efe4',
    base0D: '#66d9ef',
    base0E: '#ae81ff',
    base0F: '#cc6633'
};

export default class JSONViewer extends React.PureComponent {
    render() {
        var jsonTree = (
            <JSONTree
                theme={themed}
                className="random"
                data={this.props.result && this.props.result.data}
                valueRenderer={(val, val2, val3, val4) => {
                    if (val4 === 'changeset') {
                        return (
                            <a
                                target="_black"
                                href={`https://osmcha.mapbox.com/${val2}`}
                            >
                                {val2}
                            </a>
                        );
                    }
                    if (val2 === 'FeatureCollection') {
                        console.log('here');
                        return (
                            <a href="#">
                                {val2}
                            </a>
                        );
                    }
                    return <span>{val}</span>;
                }}
                shouldExpandNode={(keyName, data, level) => {
                    if (level < 2) return true;
                    if (Array.isArray(data)) {
                        return data.length < 6;
                    }
                    return Object.keys(data).length < 10;
                }}
            />
        );
        if (!this.props.result) {
            return null;
        }

        if (this.props.result.data && this.props.result.data.__schema) {
            return <span />;
        }

        return this.props.advanced
            ? jsonTree
            : <JSONLite value={JSON.stringify(this.props.result, null, 2)} />;
    }
}
