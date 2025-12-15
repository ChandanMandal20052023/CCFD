import { ChevronRight, CloudUpload, Download } from "lucide-react";
import React, { useState } from "react";

function Assignments() {
const [query, setQuery] = useState("");
const [file, setFile] = useState(null);
const [openIndex, setOpenIndex] = useState(null); // NEW

const quests = [
    { name: "C programming unit 1 assignment", deadline: "01 nov" },
    { name: "DECO", deadline: "15 nov" },
    { name: "Linux", deadline: "01 dec" },
    { name: "Maths calculus assignment", deadline: "expired" },
];

const filteredquests = quests.filter(
    (s) =>
    s.name.toLowerCase().includes(query.toLowerCase()) ||
    s.deadline.toLowerCase().includes(query.toLowerCase())
);

return (
    <div className="absolute m-5 mb-0 md:m-0 md:w-auto left-0 md:left-[22%] top-[22%] md:top-[15%] flex flex-wrap flex-row gap-[1rem] z-10 h-fit text-font-color md:mr-4 mr-0">
    <input type="text" placeholder="Search assignments..." value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="border border-gray-300 px-4 py-4 rounded-full font-montserrat text-gray-87 outline-none w-[100%]"/>

    <h2 className="font-manrope flex font-bold text-[20px] md:text-[22px] items-center my-4">
        Pending Assignments <ChevronRight /></h2>

    {filteredquests.map((s, i) => (
    <div key={i} onClick={() => setOpenIndex(openIndex === i ? null : i)} className="relative cursor-pointer w-full flex flex-col justify-between bg-gray-100 p-4 rounded-[10px] border shadow-sm md:mr-4 mr-0">
    <div className="flex justify-between gap-2 items-center">
    <div id="box" className="flex gap-2 flex-col">
        <h3 className="font-semibold font-montserrat text-[18px] text-font-color max-w-[100%]">{s.name}</h3>
        <p className={`text-[14px] font-montserrat text-white w-fit px-2 py-1 rounded-full font-medium ${
            s.deadline.toLowerCase() === "expired" ? "bg-gray-400 cursor-not-allowed" : "bg-[#FF4B00]"
        }`}
        >
        {s.deadline.toLowerCase() === "expired" ? "Expired" : `Submit by ${s.deadline}`}
        </p>
    </div>
      {/* DOWNLOAD BUTTON */}
    <div className="flex gap-4 items-center relative font-manrope">
    <a className="flex font-semibold px-2 py-2 bg-secondary-accent text-accent rounded-[5px]">
        <Download /> 
    </a>
      {/* DROPDOWN TOGGLE BUTTON */}
    <button
        onClick={() => setOpenIndex(openIndex === i ? null : i)}
        className="p-2 outline-none">
        <ChevronRight
        className={`transition-transform duration-200 ${
            openIndex === i ? "rotate-90" : ""}`}/></button>
    </div>
    </div>

    {/* DROPDOWN CONTENT */}
        {openIndex === i && (
        <div className="mt-3 p-3 flex flex-row gap-2 text-[14px]">
        <input
        id="fileInput"
        type="file"
        className="hidden"
        onChange={(e) => setFile(e.target.files[0])}/>

    {/* CHOOSE FILE BUTTON */}
    <button onClick={() => document.getElementById("fileInput").click()}
        className="px-4 py-3 bg-secondary-accent text-accent flex flex-row justify-center items-center gap-2 font-semibold rounded-[10px] text-[16px] font-montserrat">
        <CloudUpload />
        <span className="underline underline-offset-2">Choose File</span>
    </button>
      {/* FILE NAME PREVIEW */}
    {file && <p className="text-xs">{file.name}</p>}
      {/* SUBMIT BUTTON */}
        <button disabled={!file || s.deadline.toLowerCase() === "expired"} className={`
            px-4 py-2 text-[16px] text-white font-semibold rounded-[10px] font-montserrat
            ${s.deadline.toLowerCase() === "expired"
            ? "bg-gray-400 cursor-not-allowed"
            : "bg-accent"}
            ${!file && s.deadline.toLowerCase() !== "expired"
            ? "cursor-not-allowed"
            : ""}`}>
        Submit
        </button>        
            </div>
            )}
        </div>
    ))}
    </div>
);
}

export default Assignments;
