import React from "react";
const DummyP60form = () => {
    return (
        <div className="flex flex-row p-15">
            <div className=" bg-blue-50 w-96">
            <h1>P60 End of Year Certificate</h1>
            <div className="flex flex-direction:row">
                <h2 >Tax year to 5 April</h2>
                <input style={{ border: '2px solid' }} type="text"/>
            </div>
            <div>
                <h3>To the employee:</h3>
                <p>Please keep this certificate in a safe place
                    as you will need it if you have to fill in a tax
                    return. You also need it to make a claim for
                    tax credits and Universal Credit or to renew
                    your claim.
                    It also helps you check that your employer is
                    using the correct National Insurance number
                    and deducting the right rate of
                    National Insurance contributions. </p>
                <p>By law you are required to tell
                    HM Revenue and Customs about any
                    income that is not fully taxed, even if you
                    are not sent a tax return.
                </p>
                <p>HM Revenue and Customs</p>
                <div>
                    <p>The figures marked � should be used
                        for your tax return, if you get one</p>
                </div>
            </div>
            </div>
            <div className=" bg-red-50 w-auto">
                <h1>Employee’s details</h1>
                <form>
                    <label>Surname</label>
                    <input style={{ border: '2px solid' }} type="text"/>
                    <label>Forenames or initials</label>
                    <input style={{ border: '1px solids' }} type="text"/>
                    <div>
                    <label>National Insurance number</label>
                    <input style={{ border: '2px solid' }} type="text"/>
                    <label>Works/payroll number</label>
                    <input style={{ border: '2px solid' }} type="text"/>
                    </div>
                </form>
                <div>
                    <h2>Pay and Income Tax details</h2>
                    <form>
                        <label>In previous employments</label>
                    </form>
                </div>
            </div>
        </div>
    )
}
export default DummyP60form