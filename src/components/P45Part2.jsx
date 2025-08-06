import React from 'react';
import './P45.css';
import HMRC_Logo from "../assets/HMRC_Logo.png"
import { Link } from 'react-router-dom';

const P45Part2 = ({p45}) => {
  
  const convert = (value) => {
  let px = value * 3.78;
  return px + 'px';  
};
return (
      <div className="p45-container">
          <img className="gov-logo" style={{ left: `${convert(16)}`, top: `${convert(13.408)}` }} src={HMRC_Logo} />
          <div className="form-label"style={{ left: `${convert(171)}`, top: `${convert(8.25)}` }}>P45 Part 2</div>
          <div className="details-heading"style={{ left: `${convert(117.5)}`, top: `${convert(14.5)}` }}>Details of employee leaving work</div>
          <div className="copy-label"style={{ left: `${convert(151)}`, top: `${convert(21.25)}` }}>Copy for new employer</div>
          <div className="black-line"  style={{ left: `${convert(13)}`, top: `${convert(27.391)}` }}></div>
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
  
  <div className="horizontal-line"style={{left: convert(0),top: convert(140),}}></div>


<div style={{position: 'absolute',left: convert(13),top: convert(145.441),}}>
    <h2>To the employee</h2>
    <p style={{lineHeight:'17px'}}>
    This form is important to you. Take good care of it<br/>
    and keep it safe. Copies are not available. Please keep<br/>
    Parts 2 and 3 of the form together and do not alter them<br/>
    in any way.
  </p>
</div>

<div style={{position: 'absolute',left: convert(13),top: convert(170.441),}}>
  <p style={{fontSize:'12px'}}>Going to a new job</p>
  <p style={{lineHeight:"17.3px"}}>
    Give Parts 2 and 3 of this form to your new employer,<br/>
    or you will have tax deducted using the emergency<br/>
    code and may pay too much tax. If you do not want<br/>
    your new employer to know the details on this form,<br/>
    send it to your HM Revenue and Customs (HMRC) office<br/>
    immediately with a letter saying so and giving the<br/>
    name and address of your new employer. HMRC can<br/>
    make special arrangements, but you may pay too<br/>
    much tax for a while as a result of this.
  </p>
</div>

<div style={{position: 'absolute',left: convert(13),top: convert(217.441),}}>
   <p style={{fontSize:'12px'}}>Going abroad</p>
   <p style={{lineHeight:'16px'}}>
    If you are going abroad or returning to a country<br/>
    outside the UK fill in form P85, ‘Leaving the United Kingdom’, go to<br/>
   <Link  to="www.gov.uk/government/publications/income-tax-leaving-the-uk-getting-your-tax-right-p85"><span style={{fontWeight:'bold'}}>www.gov.uk/government/publications/income-tax-leaving-the-uk<br/>-getting-your-tax-right-p85</span></Link>
  </p>
</div>


<div style={{position: 'absolute',left: convert(13),top: convert(241.441),}}>
<p style={{fontSize:'12px'}}>Becoming self-employed</p>
  <p style={{lineHeight:'17px'}}>
    You must register with HMRC within 3 months of<br/>
    becoming self-employed or you could incur a penalty.<br/>
    To register as newly self-employed, go to<br/>
 <Link  to="www.gov.uk/topic/business-tax/self-employed"><span style={{fontWeight:'bold'}}>www.gov.uk/topic/business-tax/self-employed</span></Link>
   </p>
</div>

<div style={{position: 'absolute',left: convert(107.48),top: convert(150.733),}}><p style={{fontSize:'12px'}}>Claiming Jobseeker's Allowance or</p></div>

<div style={{position: 'absolute',left: convert(107.48),top: convert(154.733),}}><p style={{fontSize:'12px'}}>Employment and Support Allowance (ESA)</p></div>

<div style={{position: 'absolute',left: convert(107.48),top: convert(159.733),}}>
  <p style={{lineHeight:'17px'}}>Take this form to your Jobcentre Plus office. They will pay you<br/>
     any tax refund you may be entitled to when your claim ends,<br/>
     or at 5 April if this is earlier.</p>
</div>

<div style={{position: 'absolute',left: convert(107.48),top: convert(175.733),}}><p style={{fontSize:'12px'}}>Not working and not claiming Jobseeker's Allowance or</p></div>

<div style={{position: 'absolute',left: convert(107.48),top: convert(179.733),}}><p style={{fontSize:'12px'}}>Employment and Support Allowance (ESA)</p>
     <p style={{lineHeight:'17px'}}>If you have paid tax and wish to claim a refund fill in<br/>
        form P50, ‘Claiming tax back when you have stopped working’,<br/>
        go to <Link to="www.gov.uk/government/publications/income-tax-claiming-tax-back-when-you-have-stopped-working-p50"><span style={{fontWeight:'bold'}}>www.gov.uk/government/publications/income-tax-claiming-tax-back-when-you-have-stopped-working-p50</span></Link>
      </p>
</div>

<div style={{position: 'absolute',left: convert(107.48),top: convert(204.733),}}><p style={{fontSize:'12px'}}><h2>Help</h2></p>
     <p>If you need more help, go to <Link to="www.gov.uk/topic/personal-tax"><span style={{fontWeight:'bold'}}>www.gov.uk/topic/personal-tax</span></Link>
     </p>
</div>

<div style={{position: 'absolute',left: convert(107.48),top: convert(214.733),}}>
  <h2>To the new employer</h2>
  <p style={{lineHeight:'17px'}}>Check this form, record the start date and report it to HMRC in the<br/>
     first Full Payment Submission for your emloyee. Prepare a Payroll<br/>
     record/Deductions Working Sheet. Follow the instructions at<br/>
     <Link to="www.gov.uk/payroll-software"><span style={{fontWeight:'bold'}}>www.gov.uk/payroll-software</span></Link>
     </p>

</div>

<div
  style={{
    position: 'absolute',
    left: convert(13),
    top: convert(292),
    fontFamily: 'Arial, sans-serif',
    fontSize: '11.3px',
    fontWeight: 'bold',
  }}
>
  P45(Online) Part 2
</div>

<div
  style={{
    position: 'absolute',
    left: convert(180),        
    top: convert(292),        
    fontFamily: 'Arial, sans-serif',
    fontSize: '11.3px',
    fontWeight: 'normal',
  }}
>
  HMRC 03/15
</div>
     </div>

);
  };
  export default P45Part2;