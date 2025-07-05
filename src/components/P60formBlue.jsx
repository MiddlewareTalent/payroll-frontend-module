import React from "react";
const P60formBlue = () => {
    return (
        <div className="p-10 bg-white">
        <p className="flex justify-end text-sm text-blue-950">This is a printed copy of an eP60</p>
        <div className="flex flex-col bg-red-100">
        <div className="flex flex-row border-b-white gap-3 bg-red-100">
            <div className="bg-red-100 w-full">
            <h1 className="text-2xl text-blue-950 bg-white mt-3 ml-3 mr-3">P60 End of Year Certificate</h1>
            <div className="flex flex-direction:row  bg-amber-500 ml-3 mr-3">
                <h2 className="text-xl text-white p-1 ml-3">Tax year to 5 April</h2>
                <input className="bg-white w-18 h-7 m-2" type="text"/>
            </div>
            <div className="ml-3 bg-white mt-5 p-5 mr-3">
                <h3 className="text-blue-950 font-bold text-xl">To the employee:</h3>
                <p className="text-sm text-blue-950">Please keep this certificate in a safe place
                    as you will need it if you have to fill in a tax
                    return. You also need it to make a claim for
                    tax credits and Universal Credit or to renew
                    your claim.
                    It also helps you check that your employer is
                    using the correct National Insurance number
                    and deducting the right rate of
                    National Insurance contributions. </p>
                <p className="text-sm font-bold text-blue-950">By law you are required to tell
                    HM Revenue and Customs about any
                    income that is not fully taxed, even if you
                    are not sent a tax return.
                </p>
                <p className="text-blue-950">HM Revenue and Customs</p>
            </div>
            <div className="bg-blue-950 text-white m-5 p-2 ml-10">
                    <p>The figures marked * should be used
                        for your tax return, if you get one</p>
                </div>
            </div>
            <div className="bg-red-100 w-screen gap-10">
                <h1 className="bg-amber-500 text-white text-xl mb-2 pl-2">Employee’s details</h1>
                <form className="text-sm text-blue-950 gap-10">
                    <div className="flex flex-col gap-3">
                    <div className="">
                    <label className="pl-5 pr-23">Surname</label>
                    <input className="bg-white" style={{ border: '1px solid' }} type="text"/>
                    </div>
                    <div>
                    <label className="pl-5 pr-5">Forenames or initials</label>
                    <input className="bg-white" style={{ border: '1px solid' }} type="text"/>
                    </div>
                    </div>
                    <div className="flex flex-row text-sm gap-3 pt-3">
                    <div className="flex flex-col pl-5">
                    <label className="">National Insurance number</label>
                    <input className="bg-white" style={{ border: '1px solid' }} type="text"/>
                    </div>
                    <div className="flex flex-col">
                    <label>Works/payroll number</label>
                    <input className="bg-white" style={{ border: '1px solid' }} type="text"/>
                    </div>
                    </div>
                </form>
                <div>
                    <h2 className="bg-amber-500 text-white text-xl pl-2  mt-2 mb-2">Pay and Income Tax details</h2>
                    <form className="flex flex-col gap-3 text-sm pl-5 pr-23 text-blue-950">
                        <p className="text-sm font-bold ml-63"><span>Pay</span><span className="ml-35">Tax deducted</span></p>
                        <p className="ml-65">£ <span className="ml-45">£</span></p>
                        <div >
                        <label className="pr-10">In previous employments</label>
                        <input className="mr-5 bg-white" style={{ border: '1px solid' }} type="text"/>
                        <input className="bg-white" style={{ border: '1px solid' }} type="text"/>
                        </div>
                        <div className="mt-0">
                            <p className="flex justify-end mr-3 text-sm">if refund mark ‘R’</p>
                        <label className="pr-18"><span className="font-bold text-red-600">*</span>In this employment</label>
                        <input className="mr-5 bg-white" style={{ border: '1px solid' }} type="text"/>
                         <input className="bg-white"  style={{ border: '1px solid' }} type="text"/>
                        </div>
                        <div>
                        <label className="pr-29">Total for year</label>
                        <input className="mr-5 bg-white" style={{ border: '1px solid' }} type="text"/>
                         <input className="bg-white" style={{ border: '1px solid' }} type="text"/>
                        </div>
                        <div>
                        <label className="pr-23 ml-50">Final tax code</label>
                        <input className="bg-white" style={{ border: '1px solid' }} type="text"/>
                        </div>
                    </form>
                </div>
            </div>
        </div>
        <div >
           <h1 className=" bg-amber-500 text-white ml-3 pl-2 text-xl">National Insurance contributions in this employment</h1>
           <div className="flex flex-row text-sm gap-3 pt-3 text-blue-950">
                    <div className="flex flex-col pl-5">
                    <label className="mb-18">NIC table ltter</label>
            <input className="w-20 bg-white" style={{ border: '1px solid' }} type="text"/>
            <input className="w-20 bg-white" style={{ border: '1px solid' }} type="text"/>
            <input className="w-20 bg-white" style={{ border: '1px solid' }} type="text"/>
            <input className="w-20 bg-white" style={{ border: '1px solid' }} type="text"/>
                    </div>
                    <div className="flex flex-col">
                    <label className="w-60 mb-3">Earnings at the Lower Earnings Limit (LEL) (where earnings are equal to or exceed the LEL)</label>
                    <p className="ml-25">£</p>
            <input className="w-55 bg-white" style={{ border: '1px solid' }} type="text"/>
            <input className="w-55 bg-white" style={{ border: '1px solid' }} type="text"/>
            <input className="w-55 bg-white" style={{ border: '1px solid' }} type="text"/>
            <input className="w-55 bg-white" style={{ border: '1px solid' }} type="text"/>
                    </div>
                     <div className="flex flex-col">
                    <label className="w-60 mb-8">Earnings above the LEL, up to and including the Primary Threshold (PT)</label>
                     <p className="ml-25">£</p>
            <input className="w-55 bg-white" style={{ border: '1px solid' }} type="text"/>
            <input className="w-55 bg-white" style={{ border: '1px solid' }} type="text"/>
            <input className="w-55 bg-white" style={{ border: '1px solid' }} type="text"/>
            <input className="w-55 bg-white" style={{ border: '1px solid' }} type="text"/>
                    </div>
                     <div className="flex flex-col">
                    <label className="w-60 mb-3">Earnings above the PT, up to and including the Upper Earnings Limit (UEL)</label>
                     <p className="ml-25">£</p>
            <input className="w-55 bg-white" style={{ border: '1px solid' }} type="text"/>
            <input className="w-55 bg-white" style={{ border: '1px solid' }} type="text"/>
            <input className="w-55 bg-white" style={{ border: '1px solid' }} type="text"/>
            <input className="w-55 bg-white" style={{ border: '1px solid' }} type="text"/>
                    </div>
                     <div className="flex flex-col">
                    <label className="w-50 mb-8">Employee’s contributions due on all earnings above the PT</label>
                     <p className="ml-25">£</p>
            <input className="w-55 bg-white" style={{ border: '1px solid' }} type="text"/>
            <input className="w-55 bg-white" style={{ border: '1px solid' }} type="text"/>
            <input className="w-55 bg-white" style={{ border: '1px solid' }} type="text"/>
            <input className="w-55 bg-white" style={{ border: '1px solid' }} type="text"/>
                    </div>
                    </div>
           
        </div>
        <div className="mb-5">
            <h1 className=" bg-amber-500 text-white ml-3 pl-2 text-xl mt-3">Statutory payments <span className="text-sm">included in the pay ‘In this employment’ figure above</span></h1>
            <div className="flex flex-row text-sm text-blue-950">
            <div className="flex flex-row">
                <label className="pr-10 pl-5 mt-5">Statutory Maternity Pay</label>
                <input className="mt-5 bg-white" style={{ border: '1px solid' }} type="text"/>
            </div>
            <div className="flex flex-row" >
                <label className="pr-10 pl-5 mt-5">Statutory Paternity Pay</label>
                <input className="mt-5 ml-3 bg-white" style={{ border: '1px solid' }} type="text"/>
            </div>
             <div className="flex flex-row">
                <label className="pr-10 pl-5 mt-5">Statutory Shared Parental Pay</label>
                <input className="mt-5 ml-3 bg-white" style={{ border: '1px solid' }} type="text"/>
            </div>
            </div>
            <div className="flex flex-row text-sm text-blue-950">
            <div className="flex flex-row">
                <label className="pr-10 pl-5 mt-5">Statutory Adoption Pay</label>
                <input className="mt-5 bg-white" style={{ border: '1px solid' }} type="text"/>
            </div>
             <div className="flex flex-row">
                <label className="pr-10 pl-5 mt-5">Statutory Parental Bereavement Pay</label>
                <input className="mt-5 bg-white" style={{ border: '1px solid' }} type="text"/>
            </div>
             <div className="flex flex-row">
                <label className="pr-10 pl-5 mt-5">Statutory Neonatal Care Pay paid</label>
                <input className="mt-5 bg-white" style={{ border: '1px solid' }} type="text"/>
            </div>
            </div>
        </div>
        <div className="flex flex-row border-b-white gap-3bg-red-100">
            <div className="bg-red-100 w-full">
            <div className="flex flex-direction:row  bg-amber-500 ml-3 mr-3">
                <h2 className="text-xl text-white p-1 ml-3 ">Other details</h2>
            </div>
            <form className="text-sm">
                <p className="pr-10 pl-5 mt-5 text-blue-950 font-bold">Student Loan deductions <span className="font-sm font-normal ml-40">£</span></p>
                <div className="flex flex-row">
                <label className="pr-10 pl-5 text-blue-950">in this employment (whole £s only)</label>
                <input className="bg-white" style={{ border: '1px solid' }} type="text"/>
            </div>
            <p className="pr-10 pl-5 mt-5 text-blue-950 font-bold">Postgraduate Loan deductions <span className="font-sm font-normal ml-30">£</span></p>
            <div className="flex flex-row">
                <label className="pr-10 pl-5 text-blue-950">in this employment (whole £s only)</label>
                <input className="bg-white" style={{ border: '1px solid' }} type="text"/>
            </div>
            <div className="flex flex-col pl-5 mt-5 ">
            <label className="font-bold text-blue-950">To employee</label>
           <textarea className="bg-white mr-3" style={{ border: '1px solid' }}/>
            </div>
            </form>
            </div>
            <div className="bg-red-100 w-screen gap-10">
                <hr className="h-5 text-blue-950"/>
                <form className="text-sm gap-10">
                    <div className="flex flex-col gap-3">
                   <div className="flex flex-col pl-5">
            <label className="text-blue-950"><span className="font-bold">Your employer’s full name and address</span>(including postcode)</label>
           <textarea className="bg-white" style={{ border: '1px solid' }}/>
            </div>
                    <div className="text-blue-950">
                    <label className="pl-5 pr-5">Employer PAYE reference</label>
                    <input className="w-50 bg-white"style={{ border: '1px solid' }} type="text"/>
                    </div>
                    </div>
                    
                </form>
                <div>
                    <h2 className=" text-blue-950 text-xl font-bold pl-5  mt-2 mb-2">Certificate by Employer/Paying Office</h2>
                    <p className="text-sm text-blue-950 pl-5 pb-5">This form shows your total pay for Income Tax purposes
in this employment for the year.<br/>
Any overtime, bonus, commission etc, Statutory Sick Pay,
Statutory Maternity Pay, Statutory Paternity Pay, Statutory
Shared Parental Pay, Statutory Parental Bereavement Pay
or Statutory Adoption Pay is included.
</p>
                </div>
            </div>
        </div>
        </div>
        <p className="text-blue-950 text-sm ml-3">P60 (Substitute)(2025 to 2026)</p>
        </div>
    )
}
export default P60formBlue