import React, { Component } from "react"
import "./App.css"
import { Collapse } from 'antd'

class Navbar extends Component {

    constructor(props) {
        super(props)

        this.state = {

        }
    }


    render() {
        if (this.props.step == 0) {
            return (
                <div>
                    <Collapse bordered={false} defaultActiveKey={['1']} expandIconPosition="right">
                        <Collapse.Panel header="區塊鏈自主查驗系統">
                            <p style={{ fontSize: 10 }}>使用者: {this.props.account}</p>
                            <p style={{ fontSize: 10 }}>所屬單位: {this.props.company}</p>
                        </Collapse.Panel>
                    </Collapse>
                </div>
            )
        }
        else if (this.props.step == 1) {
            return (
                <div>
                    <Collapse bordered={false} defaultActiveKey={['1']} expandIconPosition="right">
                        <Collapse.Panel header="區塊鏈自主查驗系統">
                            <p style={{ fontSize: 10 }}>使用者: {this.props.account}</p>
                            <p style={{ fontSize: 10 }}>所屬單位: {this.props.company}</p>
                            <p style={{ fontSize: 10 }}>工程名稱: {this.props.project}</p>
                        </Collapse.Panel>
                    </Collapse>
                </div>
            )
        }
        else if (this.props.step == 2) {
            return (
                <div>
                    <Collapse bordered={false} defaultActiveKey={['1']} expandIconPosition="right">
                        <Collapse.Panel header="區塊鏈自主查驗系統">
                            <p style={{ fontSize: 10 }}>使用者: {this.props.account}</p>
                            <p style={{ fontSize: 10 }}>所屬單位: {this.props.company}</p>
                            <p style={{ fontSize: 10 }}>工程名稱: {this.props.project}</p>
                            <p style={{ fontSize: 10 }}>表單編號: {this.props.executeIndex}</p>
                            <p style={{ fontSize: 10 }}>查驗項目: {this.props.inspectActivity}</p>
                            <p style={{ fontSize: 10 }}>承攬廠商: {this.props.contractor}</p>
                            <p style={{ fontSize: 10 }}>查驗狀態: {this.props.inspectTimes}</p>
                            <p style={{ fontSize: 10 }}>查驗時機: {this.props.inspectTiming}</p>
                        </Collapse.Panel>
                    </Collapse>
                </div>
            )
        }
    }
}

export default Navbar

