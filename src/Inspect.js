import React, { Component } from 'react'
import Web3 from "web3"

const ipfsClient = require('ipfs-http-client')
const ipfs = ipfsClient({ host: 'ipfs.infura.io', port: 5001, protocol: 'https' })

class Inspect extends Component {

    constructor(props) {
        super(props)

        this.state = {
            results: this.props.itemsState,
            notes: null,
            photoBuffers: null,
            photos: null
        }
    }

    componentWillMount() {
        const notesArray = []
        const photoBuffersArray = []
        const photosArray = []
        for (let i = 0; i < this.props.inspectItems.length; i++) {
            notesArray.push("")
            photoBuffersArray.push("")
            photosArray.push("")
        }
        this.setState({ notes: notesArray })
        this.setState({ photoBuffers: photoBuffersArray })
        this.setState({ photos: photosArray })
    }

    inspectResult = e => {
        let results = this.state.results
        results[e.target.id] = e.target.value
        this.setState({ results })
    }

    inspectNote = e => {
        let notes = this.state.notes
        notes[e.target.id] = e.target.value
        this.setState({ notes })
    }

    photoCapture = e => {
        e.preventDefault()
        let file = e.target.files[0]
        const reader = new window.FileReader()
        reader.readAsArrayBuffer(file)
        let photoBuffers = this.state.photoBuffers
        let id = e.target.id
        reader.onloadend = () => {
            photoBuffers[id] = Buffer(reader.result)
            this.setState({ photoBuffers })
        }
    }

    photoUpload = e => {
        e.preventDefault()
        console.log("Submitting file to ipfs...")
        let id = e.target.id
        ipfs.add(this.state.photoBuffers[id], (error, result) => {
            console.log('Ipfs result', result)
            if (error) {
                console.error(error)
                return
            }
            let photos = this.state.photos
            photos[id] = result[0].hash
            this.setState({ photos })
        })
    }

    submit = () => {
        let falseNum = 0
        let note = ""
        let photo = ""
        for (let i = 0; i < this.state.results.length; i++) {
            if (this.state.results[i] == 0) {
                falseNum++
                continue
            }
            else {
                if (i == (this.state.results.length - 1)) {
                    note += this.state.notes[i]
                    photo += this.state.photos[i]
                }
                else {
                    let n = this.state.notes[i] + "@"
                    note += n
                    let p = this.state.photos[i] + "@"
                    photo += p
                }
            }
        }
        if (falseNum != 0) {
            alert("請完成表單填寫")
        }
        else {
            const date = new Date()
            const notes = window.web3.utils.fromUtf8(note)
            const photos = window.web3.utils.fromUtf8(photo)
            this.props.fillSheet(this.state.results, window.web3.utils.fromUtf8(date.toString()), notes, photos)
        }
    }

    render() {
        return (
            <div align="center">
                <p></p>
                <table border="1" style={{ width: "100%" }}>
                    {this.props.inspectItems.map((n, index) => (
                        <tbody key={index}>
                            <tr>
                                <td rowSpan="3" /*style={{ width: "10%" }}*/>#{index + 1}</td>
                                <td colSpan="2" style={{ fontSize: 18 }}>{n}</td>
                            </tr>
                            <tr>
                                <td /*style={{ width: "27%" }}*/>
                                    <span style={{ fontSize: 12 }}>查驗結果: </span>
                                    <select id={index} onChange={this.inspectResult} defaultValue={this.props.itemsState[index]}>
                                        <option value={0}>空白</option>
                                        <option value={1}>合格</option>
                                        <option value={2}>有缺失需改正</option>
                                        <option value={3}>缺失立即改善</option>
                                        <option value={4}>無此查驗項目</option>
                                    </select>
                                </td>
                                <td /*style={{ width: "36%" }}*/>
                                    <span style={{ fontSize: 12 }}>查驗照片: </span>
                                    <input id={index} type="file" accept="image/*" capture="camera" style={{ width: "80%" }} onChange={this.photoCapture}></input>
                                    {(this.state.photos[index] == "")
                                        ? <button id={index} onClick={this.photoUpload}>↑</button>
                                        : <span>已上傳</span>
                                    }
                                </td>
                            </tr>
                            <tr>
                                <td /*style={{ width: "27%" }}*/ colSpan="2">
                                    <span style={{ fontSize: 12 }}>備註: </span>
                                    <input id={index} onChange={this.inspectNote} style={{ width: "80%" }}></input>
                                </td>
                            </tr>
                        </tbody>
                    ))}
                </table>
                <p></p>
                <button onClick={this.submit}>確認</button>
            </div>
        )
    }
}

export default Inspect
