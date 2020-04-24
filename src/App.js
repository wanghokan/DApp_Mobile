import React, { Component } from "react"
import "./App.css"
import Web3 from "web3"
import Contract from "./contracts/Contract.json"
import Navbar from "./Navbar"
import SelectActivity from "./SelectActivity"
import Inspect from "./Inspect"

const ipfsClient = require('ipfs-http-client')
const ipfs = ipfsClient({ host: 'ipfs.infura.io', port: 5001, protocol: 'https' })

class App extends Component {

  constructor(props) {
    super(props)

    this.state = {
      step: 0,
      account: null,
      company: null,
      contract: null,
      projects: [],
      projectIndex: -1,
      projectName: "",
      wbs: null,
      executeIndex: 0,
      inspectActivity: "",
      contractor: "",
      inspectTimes: "",
      inspectTiming: "",
      inspectItems: [],
      itemsState: [],
      notes: null,
      photos: null
    }

    this.fillSheet = this.fillSheet.bind(this)
  }

  async componentWillMount() {
    await this.loadWeb3()
    await this.loadBlockchainData()
  }

  async loadWeb3() {
    if (window.ethereum) {
      window.web3 = new Web3(window.ethereum)
      await window.ethereum.enable()
    }
    else if (window.web3) {
      window.web3 = new Web3(window.web3.currentProvider)
    }
    else {
      window.alert('Non-Ethereum browser detected. You should consider trying MetaMask!')
    }
  }

  async loadBlockchainData() {
    const accounts = await window.web3.eth.getAccounts()
    this.setState({ account: accounts[0] })
    const networksId = await window.web3.eth.net.getId()
    const networkData = Contract.networks[networksId]
    if (networkData) {
      const authorityAbi = [
        {
          "constant": false,
          "inputs": [
            {
              "internalType": "address",
              "name": "_userAddress",
              "type": "address"
            },
            {
              "internalType": "string",
              "name": "_name",
              "type": "string"
            }
          ],
          "name": "newUser",
          "outputs": [],
          "payable": false,
          "stateMutability": "nonpayable",
          "type": "function"
        },
        {
          "constant": true,
          "inputs": [],
          "name": "userCount",
          "outputs": [
            {
              "internalType": "int256",
              "name": "",
              "type": "int256"
            }
          ],
          "payable": false,
          "stateMutability": "view",
          "type": "function"
        },
        {
          "constant": true,
          "inputs": [
            {
              "internalType": "int256",
              "name": "_id",
              "type": "int256"
            }
          ],
          "name": "userInfo",
          "outputs": [
            {
              "internalType": "string",
              "name": "_name",
              "type": "string"
            },
            {
              "internalType": "address",
              "name": "_contractAddress",
              "type": "address"
            }
          ],
          "payable": false,
          "stateMutability": "view",
          "type": "function"
        },
        {
          "constant": true,
          "inputs": [
            {
              "internalType": "address",
              "name": "",
              "type": "address"
            }
          ],
          "name": "userNum",
          "outputs": [
            {
              "internalType": "int256",
              "name": "",
              "type": "int256"
            }
          ],
          "payable": false,
          "stateMutability": "view",
          "type": "function"
        }
      ]
      const authority = new window.web3.eth.Contract(authorityAbi, "0xcdb5471f50b3febd1bc24bcbfc3e66be9c9e9497")
      const userNum = await authority.methods.userNum(this.state.account).call()
      if (userNum != 0) {
        const userInfo = await authority.methods.userInfo(userNum).call()
        console.log(userInfo)
        this.setState({ company: userInfo._name })
        const contractAddress = userInfo._contractAddress
        const contract = new window.web3.eth.Contract(Contract.abi, contractAddress)
        this.setState({ contract })
        const projects = []
        const projectsNum = await contract.methods.projectIndex().call()
        for (let i = 0; i < projectsNum; i++) {
          let prj = await contract.methods.projects(i).call()
          projects.push(prj)
        }
        this.setState({ projects })
      }
      else{
        alert("無使用權限")
      }

    } else {
      window.alert('AutonomousInspectIon contract not deployed to detected network.')
    }
  }

  importWBS = async () => {
    if (this.state.projectIndex == -1) {
      alert("請選擇專案")
      return
    }
    else {
      this.setState({ projectName: window.web3.utils.toUtf8(this.state.projects[this.state.projectIndex].name) })
      const selectedPrj = await this.state.contract.methods.projects(this.state.projectIndex).call()
      const wbs = await fetch("https://ipfs.infura.io/ipfs/" + selectedPrj.wbs).then(response => response.json())
      this.setState({ wbs })
      this.setState({ step: this.state.step + 1 })
    }
  }

  execute = async (e) => {
    const executeIndex = e.target.value
    this.setState({ executeIndex })
    let str = executeIndex.toString()
    const inspectActivity =
      this.state.wbs.term[parseInt(str.substr(0, 1))] + " - " +
      this.state.wbs.class[this.state.wbs.term[parseInt(str.substr(0, 1))]][parseInt(str.substr(1, 2))] + " - " +
      this.state.wbs.task[this.state.wbs.class[this.state.wbs.term[parseInt(str.substr(0, 1))]][parseInt(str.substr(1, 2))]][parseInt(str.substr(3, 2))] + " - " +
      this.state.wbs.location[this.state.wbs.task[this.state.wbs.class[this.state.wbs.term[parseInt(str.substr(0, 1))]][parseInt(str.substr(1, 2))]][parseInt(str.substr(3, 2))]][parseInt(str.substr(5, 3))]
    this.setState({ inspectActivity })
    const sheet = await this.state.contract.methods.sheetContent(this.state.projectIndex, executeIndex).call()
    if (sheet._executor == "0x0000000000000000000000000000000000000000") {
      alert("表單尚未建立")
      return
    }
    else {
      let falseNum = 0
      for (let i = 0; i < sheet._itemsState.length; i++) {
        if (sheet._itemsState[i] == 2) {
          falseNum++
        }
      }
      if (falseNum == 0 && sheet._executed != 0) {
        alert("此項目已完成查驗")
        return
      }
      else {
        this.setState({ contractor: window.web3.utils.toUtf8(sheet._contractor) })
        this.setState({ itemsState: sheet._itemsState })
        const itemsIndex = executeIndex - parseInt(str.substr(5, 3))
        const itemsHash = await this.state.contract.methods.inspectionItems(this.state.projectIndex, itemsIndex).call()
        const inspectItems = await fetch("https://ipfs.infura.io/ipfs/" + itemsHash).then(response => response.json())
        this.setState({ inspectItems })
        const inspectTimingArray = ["檢驗停留點", "施工中檢查", "施工完成檢查"]
        if (sheet._executed == 0) {
          this.setState({ inspectTimes: "初驗", inspectTiming: inspectTimingArray[sheet._timing] })
        }
        else if (sheet._executed != 0) {
          this.setState({ inspectTimes: "複驗", inspectTiming: inspectTimingArray[sheet._timing] })
        }
        this.setState({ step: this.state.step + 1 })
      }
    }
  }

  fillSheet(state, date, note, photo) {
    this.state.contract.methods.fillSheet(this.state.projectIndex, this.state.executeIndex, state, date, note, photo).send({ from: this.state.account }).once("transactionHash", () => { window.location.reload() })
  }

  render() {
    if (this.state.step == 0) {
      return (
        <div>
          <Navbar
            step={this.state.step}
            account={this.state.account}
            company={this.state.company} />
          <p></p>
          <section className="App">
            <span style={{ fontSize: 18 }}>請選擇專案: </span>
            <select onChange={e => this.setState({ projectIndex: e.target.value })} style={{ width: 200 }}>
              <option key={-1}>請選擇</option>
              {this.state.projects.map((prj, index) => (
                <option key={index} value={index}>{window.web3.utils.toUtf8(prj.name)}</option>
              ))}
            </select>
            <span> </span>
            <button onClick={this.importWBS}>確認</button>
          </section>
        </div>
      )
    }
    else if (this.state.step == 1) {
      return (
        <div>
          <Navbar
            step={this.state.step}
            account={this.state.account}
            company={this.state.company}
            project={this.state.projectName} />
          <p></p>
          <section className="App">
            <SelectActivity
              wbs={this.state.wbs}
              execute={this.execute} />
          </section>
        </div>
      )
    }
    else if (this.state.step == 2) {
      return (
        <div>
          <Navbar
            step={this.state.step}
            account={this.state.account}
            company={this.state.company}
            project={this.state.projectName}
            executeIndex={this.state.executeIndex}
            inspectActivity={this.state.inspectActivity}
            contractor={this.state.contractor}
            inspectTimes={this.state.inspectTimes}
            inspectTiming={this.state.inspectTiming} />
          <Inspect
            inspectItems={this.state.inspectItems}
            itemsState={this.state.itemsState}
            fillSheet={this.fillSheet} />
        </div>
      )
    }
  }
}

export default App

