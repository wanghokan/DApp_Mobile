import React, { Component } from 'react'

class SelectActivity extends Component {

    constructor(props) {
        super(props)

        this.state = {
            term: this.props.wbs.term,
            class: this.props.wbs.class,
            task: this.props.wbs.task,
            location: this.props.wbs.location,
            termIndex: 0,
            classIndex: 0,
            taskIndex: 0,
            locationIndex: 0
        }
    }


    render() {
        return (
            <div>
                <span style={{ fontSize: 18 }}>表單編號: </span>
                <input disabled={true} value={10000000 * this.state.termIndex + 100000 * this.state.classIndex + 1000 * this.state.taskIndex + 1 * this.state.locationIndex}></input>
                <p></p>
                <span style={{ fontSize: 18 }}>工程大項: </span>
                <select style={{ width: 200 }} onChange={e => this.setState({ termIndex: e.target.value, classIndex: 0, taskIndex: 0, locationIndex: 0 })}>
                    {this.state.term.map((n, index) => (
                        <option key={n} value={index}>{n}</option>
                    ))}
                </select>
                <p></p>
                <span style={{ fontSize: 18 }}>工程類別: </span>
                <select style={{ width: 200 }} onChange={e => this.setState({ classIndex: e.target.value, taskIndex: 0, locationIndex: 0 })}>
                    {this.state.class[this.state.term[this.state.termIndex]].map((n, index) => (
                        <option key={n} value={index}>{n}</option>
                    ))}
                </select>
                <p></p>
                <span style={{ fontSize: 18 }}>項目名稱: </span>
                <select style={{ width: 200 }} onChange={e => this.setState({ taskIndex: e.target.value, locationIndex: 0 })}>
                    {this.state.task[this.state.class[this.state.term[this.state.termIndex]][this.state.classIndex]].map((n, index) => (
                        <option key={n} value={index}>{n}</option>
                    ))}
                </select>
                <p></p>
                <span style={{ fontSize: 18 }}>項目名稱: </span>
                <select style={{ width: 200 }} onChange={e => this.setState({ locationIndex: e.target.value })}>
                    {this.state.location[this.state.task[this.state.class[this.state.term[this.state.termIndex]][this.state.classIndex]][this.state.taskIndex]].map((n, index) => (
                        <option key={n} value={index}>{n}</option>
                    ))}
                </select>
                <p></p>
                <button onClick={this.props.execute} value={10000000 * this.state.termIndex + 100000 * this.state.classIndex + 1000 * this.state.taskIndex + 1 * this.state.locationIndex}>執行查驗</button>
            </div>
        )
    }
}

export default SelectActivity
