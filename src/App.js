
import React, { useState } from "react";
import * as XLSX from "xlsx";
import Logo from "./sglogo.png"; // ensure this exists or replace with your path

export default function ContactImporter() {
  const [contacts, setContacts] = useState([]);
  const [fileName, setFileName] = useState("contacts");
  const [areaName, setAreaName] = useState("");
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();

    reader.onload = (evt) => {
      const data = new Uint8Array(evt.target.result);
      const workbook = XLSX.read(data, { type: "array" });

      const sheet = workbook.Sheets[workbook.SheetNames[0]];
      const rows = XLSX.utils.sheet_to_json(sheet, { header: 1 });

      let parsedContacts = rows.slice(1).map((row) => ({
        name: row[0],
        area: row[1],
        phone: row[2],
      }));

      // 1️⃣ Add country code
      parsedContacts = parsedContacts.map((c) => ({
        ...c,
        phone: c.phone?.toString().startsWith("+91")
          ? c.phone
          : "+91" + c.phone,
      }));

      // 2️⃣ Remove duplicate numbers
      const uniqueContacts = [
        ...new Map(parsedContacts.map((c) => [c.phone, c])).values(),
      ];

      setContacts(uniqueContacts);
    };

    reader.readAsArrayBuffer(file);
  };

  const downloadVCF = () => {
    let vcf = "";

    contacts.forEach((c) => {
      const fullName = `${c.name} - ${areaName}`;
      //  const fullName = `SGI Lead - ${areaName} - ${c.name}`;


      vcf += `BEGIN:VCARD
        VERSION:3.0
        N:${fullName};;;;
        FN:${fullName}
        TEL;TYPE=CELL:${c.phone}
        ADR;TYPE=HOME:;;${c.area};;;;
        END:VCARD
        `;
    });

    const blob = new Blob([vcf], { type: "text/vcard;charset=utf-8;" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = fileName + ".vcf";
    // a.download = `${fileName}_${contacts.length}.vcf`;
    a.click();
  };

  return (
    // <div style={{ padding: 40 }}>
    //   <div style={{ textAlign: "center", flex: 1 }}>
    //     <img src={Logo} alt="logo" style={{ height: 80 }} />
    //   </div>
    //   <h2>Upload Excel / CSV Contact File</h2>

    //   <input
    //     type="file"
    //     accept=".xlsx,.xls,.csv"
    //     onChange={handleFileUpload}
    //   />

    //   <br /><br />

    //   {contacts.length > 0 && (
    //     <>
    //       <h3>{contacts.length} Clean Contacts Ready</h3>
    //       <label>Enter file name</label>
    //       <input
    //         type="text"
    //         placeholder="Enter file name"
    //         value={fileName}
    //         onChange={(e) => setFileName(e.target.value)}
    //         style={{
    //           padding: "8px",
    //           width: "220px",
    //           borderRadius: "5px",
    //           border: "1px solid #ccc"
    //         }}
    //       />
    //       <br /><br />
    //       <button
    //         onClick={downloadVCF}
    //         style={{
    //           padding: "10px 20px",
    //           background: "#25D366",
    //           color: "#fff",
    //           border: "none",
    //           borderRadius: "6px",
    //           cursor: "pointer",
    //         }}
    //       >
    //         Download Contact File
    //       </button>

    //       <label>Enter Area name</label>

    //       <input
    //         type="text"
    //         placeholder="Enter Area Name"
    //         value={areaName}
    //         onChange={(e) => setAreaName(e.target.value)}
    //         style={{
    //           padding: "8px",
    //           width: "220px",
    //           borderRadius: "5px",
    //           border: "1px solid #ccc"
    //         }}
    //       />

    //       <br /><br />
    //     </>
    //   )}
    // </div>
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg,#e8f0ff,#f5f7ff)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <img src={Logo} alt="logo" style={{ height: 70, margin:"5%" }} />

      <div
        style={{
          width: "420px",
          background: "#fff",
          padding: "35px",
          borderRadius: "14px",
          boxShadow: "0 10px 30px rgba(0,0,0,0.15)",
          textAlign: "center",
        }}
      >

        <h2
          style={{
            marginBottom: 20,
            color: "#333",
            fontWeight: "600",
          }}
        >
          Excel → VCF Contact Creator
        </h2>

        <input
          type="file"
          accept=".xlsx,.xls,.csv"
          onChange={handleFileUpload}
          style={{
            width: "100%",
            padding: "10px",
            borderRadius: "6px",
            border: "1px solid #ddd",
            marginBottom: 20,
            background: "#fafafa",
            cursor: "pointer",
          }}
        />

        {contacts.length > 0 && (
          <>
            <div
              style={{
                background: "#f3f6ff",
                padding: "10px",
                borderRadius: "6px",
                marginBottom: 15,
                fontWeight: "600",
                color: "#444",
              }}
            >
              {contacts.length} Clean Contacts Ready
            </div>

            <label style={{ fontSize: 14, fontWeight: 600 }}>
              Enter File Name
            </label>

            <input
              type="text"
              placeholder="Enter file name"
              value={fileName}
              onChange={(e) => setFileName(e.target.value)}
              style={{
                width: "100%",
                padding: "10px",
                borderRadius: "6px",
                border: "1px solid #ddd",
                marginTop: 5,
                marginBottom: 15,
              }}
            />

            <label style={{ fontSize: 14, fontWeight: 600 }}>
              Enter Area Name
            </label>

            <input
              type="text"
              placeholder="Enter Area Name"
              value={areaName}
              onChange={(e) => setAreaName(e.target.value)}
              style={{
                width: "100%",
                padding: "10px",
                borderRadius: "6px",
                border: "1px solid #ddd",
                marginTop: 5,
                marginBottom: 20,
              }}
            />

            <button
              onClick={downloadVCF}
              style={{
                width: "100%",
                padding: "12px",
                background: "#25D366",
                color: "#fff",
                border: "none",
                borderRadius: "8px",
                fontSize: "16px",
                fontWeight: "600",
                cursor: "pointer",
                boxShadow: "0 5px 15px rgba(0,0,0,0.2)",
                transition: "0.3s",
              }}
            >
              Download Contact File
            </button>
          </>
        )}
      </div>
    </div>
  );
}