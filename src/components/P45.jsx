import { Routes, Route } from 'react-router-dom';
import axios from "axios";
import P45Part1 from './P45part1';
import P45Part1A from './P45part1a';
import P45Part2 from './P45part2';
import P45Part3 from './P45part3';
import { forwardRef, useEffect, useState } from "react";
import { useRef } from "react";
// import {p45} from './P45Data';
import { useParams } from "react-router-dom";

const P45 = forwardRef((props, ref) => {

    

    const [p45, setP45] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null)

    const { p45SelectedPages } = props;
    console.log("emp",props.p45SelectedEmployee)
    

    useEffect(() => {
        if (!props.p45SelectedEmployee) return;
        axios.get(`http://localhost:8080/api/custom-dto/p45/employee-data/${props.p45SelectedEmployee}`)
            .then(response => {
                console.log(response["data"])
                setP45(response["data"]);
                setLoading(false);
            })
            .catch(error => {
                console.error("Error fetching p45 data:", error)
                setError("Failed to load p45 data");
                setLoading(false);
            });
            console.log(p45)
    }, [props.p45SelectedEmployee]);

    //  useEffect(() => {
    //     console.log(employeeId)
    //     if (!employeeId) return;
    //    try{
    //     const response=axios.get(`http://localhost:8080/api/custom-dto/p45/employee-data/${employeeId}`);
    //     console.log(response)
    //    setP45(response.data);
    //    setLoading(false);
    //    }
    //    catch(e){
    //     console.error("Error fetching p45 data:", error)
    //             setError("Failed to load p45 data");
    //             setLoading(false);
    //    }
    // }, [employeeId]);

    if (loading) return <div>Loading...</div>;
    if (error) return <div>{error}</div>;

 // const {p45SelectedPages}=props;
    console.log(p45SelectedPages);
    return (
        <div className='h-screen overflow-scroll' ref={ref}>
            {p45SelectedPages.part1 && <div className="pdf-part"><P45Part1 p45={p45} /></div>}
            {p45SelectedPages.part1A && <div className="pdf-part"><P45Part1A p45={p45} /></div>}
            {p45SelectedPages.part2 && <div className="pdf-part"><P45Part2 p45={p45} /></div>}
            {p45SelectedPages.part3 && <div className="pdf-part"><P45Part3 p45={p45} /></div>}
        </div>

    );  
});
export default P45;