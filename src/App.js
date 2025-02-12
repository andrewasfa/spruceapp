import logo from "./spruceApp-logo.png";
import { useState, useEffect } from "react";
import "./App.css";
import { baseUrl } from "./config";
import Tabs from "./components/TabComponent/Tabs";

var {SyncClient} = require("twilio-sync");


function CurrentDonation(props){
  if (!props.data.amount) {
    return (
      <div className="currentDetails">
      </div>
    );
  } 
  return (
    <div className="currentDetails">
      <p>{props.data.amount}</p>
      <div>Description:</div>
      <div>{props.data.from}</div>
    </div>
  )
}

function CurrentExpense(props){
  if (!props.data.amount) {
    return (
      <div className="currentDetails">
      </div>
  )
  } 
  return (
    <div className="currentDetails">
      <p>{props.data.amount}</p>
      <p>Description:{props.data.description}</p>
    </div>
  )
}

function App() {
  const [token, setToken] = useState('');
  const [message, setMessage] = useState('');
  const [syncClient, setSyncClient] = useState(null);
  const [inT, setIncomingList] = useState([]);
  const [outT, setOutgoingList] = useState([]);
  const [currentDonation, setCurrentDonation] = useState({});
  const [currentExpense, setCurrentExpense] = useState({});

  useEffect(async ()=>{
    let token = await getAccessToken();
    var syncClient = new SyncClient(token);
    setSyncClient(syncClient);
    const incomingList = await syncClient.list('incoming');
    const outgoingList = await syncClient.list('outgoing');

    let inList = await incomingList.getItems();
    let outList = await outgoingList.getItems();

    setIncomingList(inList.items);
    setOutgoingList(outList.items);

    incomingList.on('itemAdded', event => {
      if (!event.isLocal) {
        console.log("item added", event);
        setIncomingList((inT)=> [...inT, event.item]);
      }
    });
    outgoingList.on('itemAdded', event => {
      if (!event.isLocal) {
        console.log("item added", event);
        setOutgoingList((outT)=> [...outT, event.item]);
      }
    });

    incomingList.on('itemRemoved', event =>{
      if (!event.isLocal) {
        console.log("item removed", event);
      }
    });

  },[]);


  async function getAccessToken() {
    const res = await fetch(`${baseUrl}/token`);
    const data = await res.json();
    setToken(data.token);
    return data.token; 
  }



  function showDonation(i){
    console.log(i);
    setCurrentDonation(i.data);
  }

  function showExpense(i){
    console.log(i);
    setCurrentExpense(i.data);
  }


  return (
    <div className="App">
      <div  className="topnav">
        <img className="logo" src={logo}/>
        <p>SpruceApp</p>
      </div>
      <header className="App-header">
        <h1>Bucket #1: donation counter</h1>
        <div className="instructions" >  
        1. To make a donation call  
         {/* <b>+32 460 253 236</b>  */}
         <select className="selection-box">
           <option value="+3197010252957"> (Netherlands) +3197010252957</option>
           <option value="+19284218980"> (USA) +19284218980</option>
         </select>
        <br/>
        2. Enter text Credit card number: <b>4242 4242 4242 4242</b><br/> 
        3. Expiry date (MM/YY): <b>12 25</b> (pick a date in the future)<br/>
        4. CVC security code: <b>333</b> <br/> 
        </div>
        
          <h4>Donations so far: {inT.length} </h4>

        <div className="bucketContainer">
        <CurrentDonation data={currentDonation}/>
        
        <div className="bucket">
          <div className="bucket-inT">
            {inT.map(i => (
              <div 
                className="inT" 
                style={{height:`${i.data.amount*3}px`}} 
                key={i.uri} 
                tabIndex="0"
                onClick={()=>showDonation(i)}>
                {i.data.amount}
                </div>
            ))}
          </div>

          <div className="bucket-outT">
            {outT.map(i => (
              <div 
                className="outT" 
                style={{height:`${i.data.amount*3}px`}} 
                key={i.uri}
                tabIndex="0"
                onClick={()=>showExpense(i)}>
                {i.data.amount}
              </div>
            ))}
          </div>
        </div>
        <CurrentExpense data={currentExpense}/>
       </div>

       <Tabs/>

        
        <button onClick={()=>this.methodDoesNotExist}>Special button</button>

      </header>
    </div>
  );
}

export default App;
