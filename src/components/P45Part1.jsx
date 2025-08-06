import React from 'react';
import './P45.css';
import HMRC_Logo from "../assets/HMRC_Logo.png"

const P45Part1 = ({ p45 }) => {
  const convert = (value) => {
    let px = value * 3.78;
    return px + 'px';
  };


  return (
    <div className="p45-container">
      <img className="gov-logo" style={{ left: `${convert(16)}`, top: `${convert(13.408)}` }} src={HMRC_Logo} />
      <div className="form-label" style={{ left: `${convert(167)}`, top: `${convert(8.25)}` }}>P45 Part 1</div>
      <div className="details-heading" style={{ left: `${convert(117.5)}`, top: `${convert(14.5)}` }}>Details of employee leaving work</div>
      <div className="copy-label" style={{ left: `${convert(159)}`, top: `${convert(21.25)}` }}>Copy for employee</div>
      <div className="black-line" style={{ left: `${convert(13)}`, top: `${convert(27.391)}` }}></div>
      <div className="number-box" style={{ left: `${convert(13)}`, top: `${convert(38.876)}` }}><p>1</p></div>

      <div style={{ left: convert(22), top: convert(38.876), position: 'absolute' }}><p>Employer PAYE reference</p></div>

      <div type="text" className="input-box" style={{ left: `${convert(22)}`, top: `${convert(49.039)}` }}>{p45.employerPAYEReference.slice(0, 3)}</div>

      <div style={{ left: convert(22), top: convert(44.039), position: 'absolute' }}><p>Office number</p></div>

      <div className="slash" style={{ left: `${convert(40)}`, top: `${convert(49.039)}` }}>/</div>

      <div type="text" className="large-input-box" style={{ left: `${convert(44.5)}`, top: `${convert(49.039)}` }}>{p45.employerPAYEReference.slice(4, p45.employerPAYEReference.length)}</div>

      <div style={{ left: convert(44.5), top: convert(44.039), position: 'absolute' }}><p>Reference number</p></div>

      <div className="number-box" style={{ left: `${convert(13)}`, top: `${convert(60.376)}` }}><p>2</p></div>

      <div style={{ left: convert(22), top: convert(60.376), position: 'absolute' }}><p>Employee's National Insurance number</p></div>

      <div type="text" className="input-box2" style={{ left: `${convert(22)}`, top: `${convert(65.981)}` }}>{p45.employeeNationalInsuranceNumber}</div>

      <div className="number-box" style={{ left: `${convert(13)}`, top: `${convert(77.376)}` }}><p>3</p></div>

      <div style={{ left: convert(22), top: convert(77.376), position: 'absolute' }}><p>Title - enter MR, MRS, MISS, MS or other title</p></div>

      <div type="text" className="input-box2" style={{ left: `${convert(22)}`, top: `${convert(82.897)}` }}>{p45.employeeTitle}</div>

      <div style={{ left: convert(22), top: convert(90.897), position: 'absolute' }}><p>Surname or family name</p></div>

      <div type="text" className="input-box2" style={{ left: `${convert(22)}`, top: `${convert(95.597)}` }}>{p45.lastName}</div>

      <div style={{ left: convert(22), top: convert(103.297), position: 'absolute' }}><p>First name(s)</p></div>

      <div type="text" className="input-box2" style={{ left: `${convert(22)}`, top: `${convert(108.297)}` }}>{p45.firstName}</div>

      <div className="number-box" style={{ left: `${convert(13)}`, top: `${convert(119.876)}` }}><p>4</p></div>

      <div style={{ left: convert(22), top: convert(119.876), position: 'absolute' }}><p>Leaving date DD MM YYYY</p></div>

      <div type="text" className="date" style={{ left: `${convert(22)}`, top: `${convert(125.239)}`, position: 'absolute' }}>{p45.employeeLeavingDate[2]}</div>

      <div type="text" className="date" style={{ left: `${convert(35.5)}`, top: `${convert(125.239)}`, position: 'absolute' }}>{p45.employeeLeavingDate[1]}</div>

      <div type="text" className="year" style={{ left: `${convert(49)}`, top: `${convert(125.239)}`, position: 'absolute' }}>{p45.employeeLeavingDate[0]}</div>

      <div className="number-box" style={{ left: `${convert(107.48)}`, top: `${convert(38.876)}` }}><p>5</p></div>

      <div style={{ left: convert(115.48), top: convert(38.876), position: 'absolute' }}><p>Student Loan deductions</p></div>

      <div> <input type="checkbox" checked={p45.studentLoanToContinue} className="studentloanbox" style={{ left: `${convert(116.5)}`, top: `${convert(44.797)}`, position: 'absolute' }} /></div>

      <div style={{ left: convert(122.48), top: convert(46.797), position: 'absolute' }}><p>Student Loan deductions to continue</p></div>

      <div className="number-box" style={{ left: `${convert(107.48)}`, top: `${convert(55.876)}` }}><p>6</p></div>

      <div style={{ left: convert(115.48), top: convert(55.876), position: 'absolute' }}><p>Tax code at leaving date</p></div>

      <div type="text" className="taxcode" style={{ left: `${convert(116.5)}`, top: `${convert(61.739)}`, position: 'absolute' }}>{p45.taxCodeAtLeaving}</div>

      <div style={{ left: convert(116.5), top: convert(69.739), position: 'absolute' }}><p>If week 1 or month 1 applies, enter 'X' in the box below</p></div>

      <div style={{ left: convert(116.5), top: convert(76.739), position: 'absolute' }}><p>Week 1/month 1</p></div>

      <div type="text" className="week1" style={{ left: `${convert(142.38)}`, top: `${convert(74.439)}`, position: 'absolute' }} >{p45.week1Month1Box}</div>

      <div className="number-box" style={{ left: `${convert(107.48)}`, top: `${convert(85.876)}` }}><p>7</p></div>

      {/* <div style={{ left: convert(115.48), top: convert(85.760), position: 'absolute' }}><p>Last entries on Payroll record/Deductions Working Sheet.</p></div>
  
  <div style={{ left: convert(115.48), top: convert(90.760), position: 'absolute' }}><p><span style={{fontWeight:'bold'}}> Complete only if tax code is cumulative.</span> If there is an 'X'</p></div>
  
  <div style={{ left: convert(115.48), top: convert(95.760), position: 'absolute' }}><p>at box 6 there will be no entries here.</p></div> */}
      <div style={{ left: convert(115.48), top: convert(85.760), position: 'absolute' }}><p>Last entries on Payroll record/Deductions Working Sheet.<br />

      <span style={{ fontWeight: 'bold' }}>Complete only if tax code is cumulative.</span> If there is an 'X'<br />at box 6 there will be no entries here.</p></div>

      <div> <input type="text" className="weeknumber" style={{ left: `${convert(136.45)}`, top: `${convert(99.839)}`, position: 'absolute' }} /></div>

      <div style={{ left: convert(115.5), top: convert(101.839), position: 'absolute' }}><p>Week number</p></div>

      <div style={{ left: convert(150.5), top: convert(101.839), position: 'absolute' }}><p>Month number</p></div>

      <div type="text" className="monthnumber" style={{ left: `${convert(172.1)}`, top: `${convert(99.839)}`, position: 'absolute' }}>{p45.currentPayPeriodNumber}</div>

      <div style={{ left: convert(115.5), top: convert(110.839), position: 'absolute' }}><p>Total pay to date</p></div>

      <div className="paytodatebox" style={{ left: convert(116.5), top: convert(116.755), position: 'absolute' }}>£</div>

      <div type="text" className="totalpaytodatebox" style={{ left: `${convert(122.353)}`, top: `${convert(116.755)}`, position: 'absolute' }}>{p45.totalPaytodate}</div>

      <div className="paytodatebox" style={{ left: `${convert(185.932)}`, top: `${convert(116.755)}`, position: 'absolute' }}> P</div>

      <div style={{ left: convert(115.5), top: convert(124.839), position: 'absolute' }}><p>Total tax to date</p></div>

      <div className="paytodatebox" style={{ left: convert(116.5), top: convert(129.455), position: 'absolute' }}>£</div>

      <div type="text" className="totalpaytodatebox" style={{ left: `${convert(122.353)}`, top: `${convert(129.455)}`, position: 'absolute' }}>{p45.totalTaxtodate}</div>

      <div className="paytodatebox" style={{ left: `${convert(185.932)}`, top: `${convert(129.455)}`, position: 'absolute' }}> P</div>

      <div className="horizontal-line" style={{ left: convert(0), top: convert(140), }}></div>





      <div className="number-box" style={{ left: `${convert(13)}`, top: `${convert(144.771)}` }}><p>8</p></div>

      <div style={{ left: convert(22), top: convert(144.771), position: 'absolute' }}><p style={{ lineHeight: '1.4' }}>This employment pay and tax.Leave blank if the Tax Code<br /> is cumulative and the amounts are the same as box 7</p></div>

      <div style={{ left: convert(22), top: convert(154.097), position: 'absolute' }}><p style={{ lineHeight: '1.3' }}>Total pay in this employment</p></div>

      <div className="paytodatebox" style={{ left: convert(22), top: convert(159.097), position: 'absolute' }}>£</div>

      <div type="text" className="totalpaytodatebox" style={{ left: `${convert(27.853)}`, top: `${convert(159.097)}`, position: 'absolute' }} >{p45.totalPayInThisEmployment}</div>

      <div className="paytodatebox" style={{ left: `${convert(91.432)}`, top: `${convert(159.097)}`, position: 'absolute' }}> P</div>

      <div style={{ left: convert(22), top: convert(167.097), position: 'absolute' }}><p style={{ lineHeight: '1.4' }}>Total tax in this employment</p></div>

      <div className="paytodatebox" style={{ left: convert(22), top: convert(171.797), position: 'absolute' }}>£</div>

      <div type="text" className="totalpaytodatebox" style={{ left: `${convert(27.853)}`, top: `${convert(171.797)}`, position: 'absolute' }} >{p45.totalTaxInThisEmployment}</div>

      <div className="paytodatebox" style={{ left: `${convert(91.432)}`, top: `${convert(171.797)}`, position: 'absolute' }}> P</div>

      <div className="number-box" style={{ left: `${convert(13)}`, top: `${convert(181.787)}` }}><p>9</p></div>

      <div style={{ left: convert(22), top: convert(181.787), position: 'absolute' }}><p style={{ lineHeight: '1.3' }}>Works number/Payroll number and Department or branch<br /> (if any)</p></div>

      <div><input type="text" className="worknumber" style={{ left: convert(22), top: convert(191.203), position: 'absolute' }} /></div>

      <div className="number-box" style={{ left: `${convert(13)}`, top: `${convert(208.139)}` }}><p>10</p></div>

      <div style={{ left: convert(22), top: convert(208.139), position: 'absolute' }}><p>Gender. Enter 'X' in the appropriate box</p></div>

      <div><input value={p45.employeeGender=== 'male' ? 'X' : ''} type="text" className="male" style={{ left: convert(32.994), top: convert(214.139), position: 'absolute', }} /></div>

      <div style={{ left: convert(24), top: convert(216.139), position: 'absolute' }}><p>Male</p></div>

      <div style={{ left: convert(44.994), top: convert(216.139), position: 'absolute' }}><p>Female</p></div>

      <div type="text" className="female" style={{ left: convert(56.994), top: convert(214.139), position: 'absolute', }}>{p45.employeeGender=== 'female' ? '' : 'X'}</div>

      <div className="number-box" style={{ left: `${convert(13)}`, top: `${convert(225.639)}` }}><p>11</p></div>

      <div style={{ left: convert(22), top: convert(225.639), position: 'absolute' }}><p>Date of birth DD MM YYYY</p></div>

      <div type="text" className="date" style={{ left: `${convert(22)}`, top: `${convert(231.055)}`, position: 'absolute' }}>{p45.employeeDateOfBirth[2]}</div>

      <div type="text" className="date" style={{ left: `${convert(35.5)}`, top: `${convert(231.055)}`, position: 'absolute' }}>{p45.employeeDateOfBirth[2]}</div>

      <div type="text" className="year" style={{ left: `${convert(49)}`, top: `${convert(231.055)}`, position: 'absolute' }}>{p45.employeeDateOfBirth[0]}</div>

      <div className="number-box" style={{ left: `${convert(107.48)}`, top: `${convert(144.771)}` }}><p>12</p></div>

      <div style={{ left: convert(116.48), top: convert(144.771), position: 'absolute' }}><p>Employee’s private address</p></div>

      <div type="text" className="employee-private-address" style={{ left: convert(116.5), top: convert(151.325), position: 'absolute' }}><p>{p45.employeeAddress}</p></div>

      <div style={{ left: convert(116.5), top: convert(171.039), position: 'absolute' }}><p>Postcode</p></div>

      <div type="text" className="postcode" style={{ left: convert(116.5), top: convert(176.039), position: 'absolute' }}>{p45.employeePostCode}</div>

      <div className="number-box" style={{ left: `${convert(107.48)}`, top: `${convert(185.597)}` }}><p>13</p></div>

      <div style={{ left: convert(116.48), top: convert(185.597), position: 'absolute' }}><p style={{ lineHeight: '1.5' }}>I certify that the details entered in items 1 to 11 on<br />this form are correct.</p></div>

      <div style={{ left: convert(116.5), top: convert(195.347), position: 'absolute' }}><p >Employer name and address</p></div>

      <div type="text" className="employer-address-box" style={{ left: convert(116.5), top: convert(200.347), position: 'absolute', lineHeight: '1.5' }}><p>{p45.companyName}{p45.companyAddress}</p></div>

      <div style={{ left: convert(116.5), top: convert(227.055), position: 'absolute' }}><p>Postcode</p></div>

      <div type="text" className="postcode" style={{ left: convert(116.5), top: convert(231.055), position: 'absolute' }}> {p45.companyPostCode}</div>

      <div style={{ left: convert(116.5), top: convert(239.755), position: 'absolute' }}><p>Date DD MM YYYY</p></div>

      <div type="text" className="date" style={{ left: `${convert(116.5)}`, top: `${convert(243.755)}`, position: 'absolute' }}>{p45.p45Date[2]}</div>

      <div type="text" className="date" style={{ left: `${convert(130)}`, top: `${convert(243.755)}`, position: 'absolute' }}>{p45.p45Date
[1]}</div>

      <div type="text" className="year" style={{ left: `${convert(143.5)}`, top: `${convert(243.755)}`, position: 'absolute' }}>{p45.p45Date
[0]}</div>

    </div>
  );
};

export default P45Part1;
