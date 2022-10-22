import React, {useState} from "react";
import { baseUrl } from "../../config";


const FirstTab = () => {
  const [message, setMessage] = useState('');

  async function createExpense(){
    
    let expense = { 
        amount: parseFloat(document.getElementById('amount').value),
        description: document.getElementById('description').value 
      };
  
    console.log('sending this', expense);
    const res = await fetch(
      `${baseUrl}/handleOutgoing`,
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
    setMessage(`${ data.response} - Total of ${data.entries.length} notified`);
    if (data.response && data.response == 'updated'){
      console.log('success');
      document.getElementById('amount').value = '';
      document.getElementById('description').value = '';
    }
    return data
  
  }

  return (
    <div className="FirstTab">
        <div className="expense-form">
          <input id='amount' className="expense-field" min="10" type="number" placeholder="Amount"></input>
          <textarea id='description' className="expense-field"  type="text" placeholder="Description"></textarea>
          <button onClick={()=>{createExpense()}}>Submit</button>
          <h2>{message}</h2>
        </div>
    </div>
  );
};
export default FirstTab;
