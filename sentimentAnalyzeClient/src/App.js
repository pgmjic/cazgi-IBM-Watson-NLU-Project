import './bootstrap.min.css';
import './App.css';
import EmotionTable from './EmotionTable.js';
import React from 'react';

const Emoji = props => (
  <span
      className="emoji"
      role="img"
      aria-label={props.label ? props.label : ""}
      aria-hidden={props.label ? "false" : "true"}
  >
    {props.symbol}
  </span>
);

const ErrorMessage = props => (
  <div class="alert alert-warning alert-dismissible fade show" role="alert">
    <strong>Error occurred!</strong> {props.msgText}
      {props.resetMsg()}
  </div>
);

class App extends React.Component {
  /*
  We are setting the component as a state named innercomp.
  When this state is accessed, the HTML that is set as the 
  value of the state, will be returned. The initial input mode
  is set to text
  */
  state = {
    innercomp:<textarea rows="4" cols="50" id="textinput"/>,
    mode: "text",
    sentimentOutput:[],
    sentiment:true,
    errorMsg: "" 
  }
  
  /*
  This method returns the component based on what the input mode is.
  If the requested input mode is "text" it returns a textbox with 4 rows.
  If the requested input mode is "url" it returns a textbox with 1 row.
  */
 
  renderOutput = (input_mode)=>{
    let rows = 1
    let mode = "url"
    //If the input mode is text make it 4 lines
    if(input_mode === "text"){
      mode = "text"
      rows = 4
    }
    this.setState({innercomp:<textarea rows={rows} cols="50" id="textinput"/>,
      mode: mode,
      sentimentOutput:[],
      sentiment:true,
    });
  } 
  
  sendForSentimentAnalysis = () => {
    // check for text in textbox
    if (document.getElementById("textinput").value.length>0) {
      this.setState({sentiment:true});
      let url = ".";
      let mode = this.state.mode
      url = url+"/" + mode + "/sentiment?"+ mode + "="+document.getElementById("textinput").value;
      fetch(url).then((response)=>{
        if (response.status === 200) {
          response.json().then((data)=>{
            if (data.hasOwnProperty('label')) {
              this.setState({sentimentOutput:data.label});
              let output = data.label;
              let color = "yellow"
              let symbol = "😐"

              switch(output) {
                case "positive": 
                  color = "green"
                  symbol = "🙂"
                  break;
                case "negative": 
                  color = "red";
                  symbol = "☹️"
                  break;
                default: 
                  color = "yellow";
                  symbol = "😐"
              }
              output = <div style={{color:color,fontSize:20}}>{output}<Emoji symbol={symbol} label={output}/></div>
              this.setState({sentimentOutput:output});
            }
            else {
              if (data.hasOwnProperty('status'))
                this.setState({errorMsg:`${data.status}: ${data.statusText}`, sentimentOutput: []});
            }
          })
        }
        else if (response.status >= 400) {
          this.setState({errorMsg:`${response.status}: ${response.statusText}`, sentimentOutput: []});
        }
      });
    }
    else {
      this.setState({errorMsg:"You haven't entered any text!!", sentimentOutput: []});
    }
  }

  sendForEmotionAnalysis = () => {
    // check for text in textbox
    if (document.getElementById("textinput").value.length>0) {
      this.setState({sentiment:false});
      let url = ".";
      let mode = this.state.mode
      url = url+"/" + mode + "/emotion?"+ mode + "="+document.getElementById("textinput").value;

      fetch(url).then((response)=>{
        if (response.status === 200) {
          response.json().then((data) => {
            console.log(data)
            if (data.hasOwnProperty('status')) {
              this.setState({errorMsg: `${data.status}: ${data.statusText}`, sentimentOutput: []});
            }
            else {
              this.setState({sentimentOutput:<EmotionTable emotions={data}/>});
            }
          })
        }
        else if (response.status >= 400) {
          this.setState({errorMsg:`${response.status}: ${response.statusText}`, sentimentOutput: []});
        }
      });
    }
    else {
      this.setState({errorMsg:"You haven't entered any text!!", sentimentOutput: []});
    }
  }  

  render() {
    return (
      <>
        <div className="App-header">Sentiment Analyzer</div>
        <div className="App">
            <button className="btn btn-info" onClick={() => { this.renderOutput('text') }}>Text</button>
            <button className="btn btn-dark" onClick={() => { this.renderOutput('url') }}>URL</button>
            <br /><br />
            {this.state.innercomp}
            <br />
            <button className="btn btn-primary mb-2" onClick={this.sendForSentimentAnalysis}>Analyze Sentiment</button>
            <span className="mx-2"/>
            <button className="btn btn-primary mb-2" onClick={this.sendForEmotionAnalysis}>Analyze Emotion</button>
            <br />
            {this.state.sentimentOutput}
            <br />
            {this.state.errorMsg.length>0 && 
              <ErrorMessage resetMsg={()=>setTimeout(()=>this.setState({errorMsg:"", sentimentOutput:[]}),5000)} msgText={this.state.errorMsg}/> }
        </div>
      </>
    );
  }
}

export default App;
