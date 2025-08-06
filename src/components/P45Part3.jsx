import React from 'react';
import './P45.css';
import HMRC_Logo from "../assets/HMRC_Logo.png"

const P45Part3 = ({p45}) => {
  
  const convert = (value) => {
  let px = value * 3.78;
  return px + 'px';  
};


  return (
      <div className="p45-container">
          <img className="gov-logo" style={{ left: `${convert(16)}`, top: `${convert(13.408)}` }} src={HMRC_Logo} />
          <div className="form-label"style={{ left: `${convert(171)}`, top: `${convert(8.25)}` }}>P45 Part 3</div>
          <div className="details-heading"style={{ left: `${convert(143.5)}`, top: `${convert(14.5)}` }}>New employee details</div>
          <div className="copy-label"style={{ left: `${convert(138.75)}`, top: `${convert(21.25)}` }}>For completion by new employer</div>
          <div className="black-line"  style={{ left: `${convert(13)}`, top: `${convert(27.391)}` }}></div>
          <div className="capital-letters"  style={{ left: `${convert(13)}`, top: `${convert(32.986)}` }}>Use capital letters when completing this form</div>
          <div className="number-box"  style={{ left: `${convert(13)}`, top: `${convert(38.876)}` }}>1</div>
  
  <div style={{ left: convert(22), top: convert(38.876), position: 'absolute' }}><p>Employer PAYE reference</p></div>
  
  <div type="text" className="input-box"style={{ left: `${convert(22)}`, top: `${convert(49.039)}` }}>{p45.employerPAYEReference.slice(0,3)}</div>
  
  <div style={{ left: convert(22), top: convert(44.039), position: 'absolute' }}><p>Office number</p></div>
  
  <div className="slash"style={{ left: `${convert(40)}`, top: `${convert(49.039)}` }}>/</div>
  
  <div type="text" className="large-input-box"style={{ left: `${convert(44.5)}`, top: `${convert(49.039)}` }}>{p45.employerPAYEReference.slice(4,p45.employerPAYEReference.length)}</div>
  
  <div style={{ left: convert(44.5), top: convert(44.039), position: 'absolute' }}><p>Reference number</p></div>
  
  <div className="number-box"  style={{ left: `${convert(13)}`, top: `${convert(60.376)}` }}>2</div>
  
  <div style={{ left: convert(22), top: convert(60.376), position: 'absolute' }}><p>Employee's National Insurance number</p></div>
  
  <div type="text" className="input-box2"style={{ left: `${convert(22)}`, top: `${convert(65.981)}` }}>{p45.employeeNationalInsuranceNumber}</div>
  
  <div className="number-box"  style={{ left: `${convert(13)}`, top: `${convert(77.376)}` }}>3</div>
  
  <div style={{ left: convert(22), top: convert(77.376), position: 'absolute' }}><p>Title - enter MR, MRS, MISS, MS or other title</p></div>
  
  <div type="text" className="input-box2"style={{ left: `${convert(22)}`, top: `${convert(82.897)}` }}>{p45.employeeTitle}</div>
  
  <div style={{ left: convert(22), top: convert(90.897), position: 'absolute' }}><p>Surname or family name</p></div>
  
  <div type="text" className="input-box2"style={{ left: `${convert(22)}`, top: `${convert(95.597)}` }}>{p45.lastName}</div>
  
  <div style={{ left: convert(22), top: convert(103.297), position: 'absolute' }}><p>First name(s)</p></div>
  
  <div type="text" className="input-box2"style={{ left: `${convert(22)}`, top: `${convert(108.297)}` }}>{p45.firstName}</div>
  
  <div className="number-box"  style={{ left: `${convert(13)}`, top: `${convert(119.876)}` }}>4</div>
  
  <div style={{ left: convert(22), top: convert(119.876), position: 'absolute' }}><p>Leaving date DD MM YYYY</p></div>
  
  <div type="text" className="date" style={{ left: `${convert(22)}`, top: `${convert(125.239)}`, position:'absolute' }}>{p45.employeeLeavingDate[2]}</div>
  
  <div type="text" className="date" style={{ left: `${convert(35.5)}`, top: `${convert(125.239)}`, position:'absolute' }}>{p45.employeeLeavingDate[1]}</div>
  
  <div type="text" className="year" style={{ left: `${convert(49)}`, top: `${convert(125.239)}`, position:'absolute' }}>{p45.employeeLeavingDate[0]}</div>
  
  <div className="number-box"  style={{ left: `${convert(107.48)}`, top: `${convert(38.876)}` }}>5</div>
  
  <div style={{ left: convert(115.48), top: convert(38.876), position: 'absolute' }}><p>Student Loan deductions</p></div>
  
  <div> <input type="checkbox" checked={p45.studentLoanToContinue} className="studentloanbox" style={{ left: `${convert(116.5)}`, top: `${convert(44.797)}`, position:'absolute' }}/></div>
  
  <div style={{ left: convert(122.48), top: convert(46.797), position: 'absolute' }}><p>Student Loan deductions to continue</p></div>
  
  <div className="number-box"  style={{ left: `${convert(107.48)}`, top: `${convert(55.876)}` }}>6</div>
  
  <div style={{ left: convert(115.48), top: convert(55.876), position: 'absolute' }}><p>Tax code at leaving date</p></div>
  
  <div type="text" className="taxcode"style={{ left: `${convert(116.5)}`, top: `${convert(61.739)}`,position: 'absolute' }}>{p45.taxCodeAtLeaving}</div>
  
  <div style={{ left: convert(116.5), top: convert(69.739), position: 'absolute' }}><p>If week 1 or month 1 applies, enter 'X' in the box below</p></div>
  
  <div style={{ left: convert(116.5), top: convert(76.739), position: 'absolute' }}><p>Week 1/month 1</p></div>
  
  <div type="text" className="week1" style={{ left: `${convert(142.38)}`, top: `${convert(74.439)}`, position:'absolute' }}>{p45.week1Month1Box}</div>
  
  <div className="number-box"  style={{ left: `${convert(107.48)}`, top: `${convert(85.876)}` }}>7</div>
  
  <div style={{ left: convert(115.48), top: convert(85.760), position: 'absolute' }}><p>Last entries on Payroll record/Deductions Working Sheet.</p></div>
  
  <div style={{ left: convert(115.48), top: convert(90.760), position: 'absolute' }}><p><span style={{fontWeight:'bold'}}> Complete only if tax code is cumulative.</span> If there is an 'X'</p></div>
  
  <div style={{ left: convert(115.48), top: convert(95.760), position: 'absolute' }}><p>at box 6 there will be no entries here.</p></div>
  
  <div> <input type="text" className="weeknumber" style={{ left: `${convert(136.45)}`, top: `${convert(101.839)}`, position:'absolute' }}/></div>
  
  <div style={{ left: convert(115.5), top: convert(103.839), position: 'absolute' }}><p>Week number</p></div>
  
  <div style={{ left: convert(150.5), top: convert(103.839), position: 'absolute' }}><p>Month number</p></div>
  
  <div type="text" className="monthnumber" style={{ left: `${convert(172.1)}`, top: `${convert(101.839)}`, position:'absolute' }}>{p45.currentPayPeriodNumber}</div>
  
  <div style={{ left: convert(115.5), top: convert(110.839), position: 'absolute' }}><p>Total pay to date</p></div>
  
  <div className="paytodatebox" style={{ left: convert(116.5), top: convert(116.755), position: 'absolute' }}>£</div>
  
  <div type="text" className="totalpaytodatebox"style={{ left: `${convert(122.353)}`, top: `${convert(116.755)}`,position:'absolute' }}>{p45.totalPayToDate}</div>
  
  <div className="paytodatebox" style={{ left: `${convert(185.932)}`, top: `${convert(116.755)}`,position:'absolute' }}> P</div>
  
  <div style={{ left: convert(115.5), top: convert(124.839), position: 'absolute' }}><p>Total tax to date</p></div>
  
  <div className="paytodatebox" style={{ left: convert(116.5), top: convert(129.455), position: 'absolute' }}>£</div>
  
  <div type="text" className="totalpaytodatebox"style={{ left: `${convert(122.353)}`, top: `${convert(129.455)}`,position:'absolute' }}>{p45.totalTaxToDate}</div>
  
  <div className="paytodatebox" style={{ left: `${convert(185.932)}`, top: `${convert(129.455)}`,position:'absolute' }}> P</div>
  


  
  <div style={{ fontSize: '14.7px', fontWeight: 'bold', left: `${convert(13)}`, top: `${convert(140.96)}`, position: 'absolute' }}>
  <span style={{ fontFamily: 'Arial', fontWeight: 'bold' }}>To the new employer</span>
  <span style={{ fontFamily: 'Arial', fontWeight: 'normal', marginLeft: '10px' }}>
    You will need these details to complete your Full Payment Submission
  </span>
</div>


  <div className="number-box"  style={{ left: `${convert(13)}`, top: `${convert(148.937)}` }}>8</div>

  <div style={{ left: convert(21), top: convert(148.96), position: 'absolute' }}><p> New Employer PAYE reference</p></div>
  
  <div> <input type="text" className="input-box"style={{ left: `${convert(22)}`, top: `${convert(159.097)}` }}/></div>
  
  <div style={{ left: convert(22), top: convert(153.96), position: 'absolute' }}><p>Office number</p></div>
  
  <div className="slash"style={{ left: `${convert(40)}`, top: `${convert(158.96)}` }}>/</div>
  
  <div> <input type="text" className="large-input-box"style={{ left: `${convert(44)}`, top: `${convert(159.097)}` }}/></div>
  
  <div style={{ left: convert(44), top: convert(153.96), position: 'absolute' }}><p>Reference number</p></div>

  <div className="number-box"  style={{ left: `${convert(13)}`, top: `${convert(167.437)}` }}>9</div>

  <div style={{ left: convert(21), top: convert(167.437), position: 'absolute' }}><p>Date new employment started DD MM YYYY</p></div>
  
  <div> <input type="text" className="date" style={{ left: `${convert(22)}`, top: `${convert(171.797)}`, position:'absolute' }}/></div>
  
  <div> <input type="text" className="date" style={{ left: `${convert(35.5)}`, top: `${convert(171.797)}`, position:'absolute' }}/></div>
  
  <div> <input type="text" className="year" style={{ left: `${convert(49)}`, top: `${convert(171.797)}`, position:'absolute' }}/></div>

  <div className="number-box"  style={{ left: `${convert(13)}`, top: `${convert(182.937)}` }}>10</div>

  <div style={{ left: convert(21), top: convert(182.937), position: 'absolute' }}><p>Works number/Payroll number and Department or branch<br/> (if any)</p></div>

  <div><input type="text" className="worknumber" style={{ left: convert(22), top: convert(191.203), position: 'absolute' }}/></div>

  <div className="number-box"  style={{ left: `${convert(13)}`, top: `${convert(208.957)}` }}>11</div>

  <div style={{ left: convert(21), top: convert(208.957), position: 'absolute' }}><p style={{lineHeight:'17px'}}>Enter 'P' here if employee will not be paid by you<br/>
                  between the date employment began and the<br/>
                  next 5 April.</p></div>

  <div> <input type="checkbox" className="studentloanbox" style={{ left: `${convert(86.5)}`, top: `${convert(214.139)}`, position:'absolute' }}/></div>

  <div className="number-box"  style={{ left: `${convert(13)}`, top: `${convert(225.937)}` }}>12</div>

  <div style={{ left: convert(21), top: convert(225.937), position: 'absolute' }}><p>Enter tax code in use if different to the tax code at box 6</p></div>

  <div> <input type="text" className="taxcode"style={{ left: `${convert(22)}`, top: `${convert(231.055)}`,position: 'absolute' }}/></div>

  <div style={{ left: convert(22), top: convert(239.055), position: 'absolute' }}><p>If week 1 or month 1 applies, enter 'X' in the box below</p></div>
  
  <div style={{ left: convert(22.4), top: convert(245.755), position: 'absolute' }}><p>Week 1/month 1</p></div>
  
  <div> <input type="text" className="week1" style={{ left: `${convert(47.4)}`, top: `${convert(243.755)}`, position:'absolute' }}/></div>
  

  <div className="number-box"  style={{ left: `${convert(13)}`, top: `${convert(251.437)}` }}>13</div>

  <div style={{ left: convert(21), top: convert(251.437), position: 'absolute' }}><p style={{lineHeight:'17px'}}>If the tax figure you are entering on Payroll<br/>
                  record/Deductions Working Sheet differs from box 7<br/>
                  please enter the figure here.</p></div>
                   
  <div className="paytodatebox" style={{ left: convert(22), top: convert(269.155), position: 'absolute' }}>£</div>
  
  <div> <input type="text" className="totalpaytodatebox"style={{ left: `${convert(27.853)}`, top: `${convert(269.155)}`,position:'absolute' }}/></div>
  
  <div className="paytodatebox" style={{ left: `${convert(91.432)}`, top: `${convert(269.155)}`,position:'absolute' }}> P</div>

  <div className="number-box"  style={{ left: `${convert(13)}`, top: `${convert(280.937)}` }}>14</div>

  <div style={{ left: convert(21), top: convert(280.937), position: 'absolute' }}><p>New employee's job title or job description</p></div>

  <div> <input type="text" className="input-box2"style={{ left: `${convert(22)}`, top: `${convert(286.097)}` }}/></div>

  <div className="number-box"  style={{ left: `${convert(107.48)}`, top: `${convert(148.937)}` }}>15</div>

  <div style={{ left: convert(116.48), top: convert(148.937), position: 'absolute' }}><p>Employee’s private address</p></div>

  <div type="text" className="employee-private-address" style={{ left: convert(116.5), top: convert(155.541), position: 'absolute' }}>{p45.employeePrivateAddress}</div>

  <div style={{ left: convert(116.5), top: convert(175.255), position: 'absolute' }}><p>Postcode</p></div>

  <div type="text" className="postcode" style={{ left: convert(116.5), top: convert(180.255), position: 'absolute'}} >{p45.employeePostcode}</div>

  <div className="number-box"  style={{ left: `${convert(107.48)}`, top: `${convert(188.437)}` }}>16</div>

  <div style={{ left: convert(115.48), top: convert(188.937), position: 'absolute' }}><p>Gender. Enter 'X' in the appropriate box</p></div>

  <div><input value={p45.gender==='male'?'X':''} className="male" style={{left: convert(127.805),top: convert(192.955),position: 'absolute',}}/></div>

  <div style={{ left: convert(118), top: convert(194.955), position: 'absolute' }}><p>Male</p></div>

  <div style={{ left: convert(140), top: convert(194.955), position: 'absolute' }}><p>Female</p></div>

  <div type="text" className="female" style={{left: convert(153),top: convert(192.955),position: 'absolute',}}>{p45.gender==='female'?'X':''}</div>

  <div className="number-box"  style={{ left: `${convert(107.48)}`, top: `${convert(204.437)}` }}>17</div>

  <div style={{ left: convert(115.48), top: convert(204.437), position: 'absolute' }}><p>Date of birth DD MM YYYY</p></div>
  
  <div type="text" className="date" style={{ left: `${convert(116.5)}`, top: `${convert(209.897)}`, position:'absolute' }}>{p45.employeeDateOfBirth[2]}</div>
  
  <div type="text" className="date" style={{ left: `${convert(130)}`, top: `${convert(209.897)}`, position:'absolute' }}>{p45.employeeDateOfBirth[1]}</div>
  
  <div type="text" className="year" style={{ left: `${convert(143.5)}`, top: `${convert(209.897)}`, position:'absolute' }}>{p45.employeeDateOfBirth[0]}</div>

  <div  style={{left: `${convert(107.48)}`, top: `${convert(217.437)}`,position:'absolute' }}> <h2>Declaration</h2></div>

  <div className="number-box"  style={{ left: `${convert(107.48)}`, top: `${convert(228.437)}` }}>18</div>

  <div style={{ left: convert(115.48), top: convert(227.437), position: 'absolute' }}><p style={{lineHeight:'17px'}}>I have prepared a Payroll record/Deductions Working<br/>
                  Sheet in accordance with the details above.<br/>
                  </p></div>

  <div  style={{left: `${convert(115.48)}`, top: `${convert(237.437)}`,position:'absolute' }}> <p>Employer name and address</p></div>

  <div><input type="text" className="employer-address-box" style={{ left: convert(116.5), top: convert(242.688), position: 'absolute' }}/></div>

  <div style={{ left: convert(116.5), top: convert(268.688), position: 'absolute' }}><p>Postcode</p></div>

  <div> <input type="text" className="postcode" style={{ left: convert(116.5), top: convert(273.397), position: 'absolute'}} /></div>

  <div style={{ left: convert(116.5), top: convert(280.755), position: 'absolute' }}><p>Date DD MM YYYY</p></div>

  <div> <input type="text" className="date" style={{ left: `${convert(116.5)}`, top: `${convert(286.097)}`, position:'absolute' }}/></div>
  
  <div> <input type="text" className="date" style={{ left: `${convert(130)}`, top: `${convert(286.097)}`, position:'absolute' }}/></div>
  
  <div> <input type="text" className="year" style={{ left: `${convert(143.5)}`, top: `${convert(286.097)}`, position:'absolute' }}/></div>

  <div
  style={{
    position: 'absolute',
    left: convert(13),
    top: convert(293.37),
    fontFamily: 'Arial, sans-serif',
    fontSize: '11.3px',
    fontWeight: 'bold',
  }}
>
  P45(Online) Part 3
</div>

<div
  style={{
    position: 'absolute',
    left: convert(180),        
    top: convert(293.37),        
    fontFamily: 'Arial, sans-serif',
    fontSize: '11.3px',
    fontWeight:'normal'
  }}
>
  HMRC 03/15
</div>

</div>
    );
  };
  

export default P45Part3;
