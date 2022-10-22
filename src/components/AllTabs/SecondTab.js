// SecondTab.js

import React, {useState} from "react";
import { baseUrl } from "../../config";
const SecondTab = () => {

  const [message, setMessage] = useState('');

  async function createDonation(){
    
    let expense = { 
        amount: parseFloat(document.getElementById('amount').value),
        donorName: document.getElementById('donorName').value,
        from: document.getElementById('from').value,
      };
  
    console.log('sending this', expense);
    const res = await fetch(
      `${baseUrl}/handleIncoming`,
      {
        method: "POST",
        body: JSON.stringify(expense),
        headers: {
          'Content-Type': 'application/json'
          // 'Content-Type': 'application/x-www-form-urlencoded',
        },
      });
    const data = await res.json();
    console.log(data);
    setMessage(`${ data.response} - Submitted`);
    if (data.response && data.response == 'updated'){
      console.log('success');
      document.getElementById('amount').value = '';
      document.getElementById('donorName').value = '';
      document.getElementById('from').value = '';
    }
    return data
  
  }

  return (
    <div className="SecondTab">
        <div className="expense-form">
          <input id='amount' className="expense-field" min="10" type="number" placeholder="Amount"></input>
          <textarea id='donorName' className="expense-field"  type="text" placeholder="Name"></textarea>
          <textarea id='from' className="expense-field"  type="text" placeholder="Contact number"></textarea>
          <button onClick={()=>{createDonation()}}>Submit</button>
          <h2>{message}</h2>
        </div>
    </div>
  );
};

export default SecondTab;