
import React, { useState } from "react";
import * as XLSX from "xlsx";
import Logo from "./sglogo.png"; // ensure this exists or replace with your path

export default function ContactImporter() {
  const [contacts, setContacts] = useState([]);
  const [fileName, setFileName] = useState("contacts");
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
      const fullName = `SGI Lead - ${c.name}`;

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
    <div style={{ padding: 40 }}>
      <div style={{ textAlign: "center", flex: 1 }}>
        <img src={Logo} alt="logo" style={{ height: 80 }} />
      </div>
      <h2>Upload Excel / CSV Contact File</h2>

      <input
        type="file"
        accept=".xlsx,.xls,.csv"
        onChange={handleFileUpload}
      />

      <br /><br />

      {contacts.length > 0 && (
        <>
          <h3>{contacts.length} Clean Contacts Ready</h3>
          <input
            type="text"
            placeholder="Enter file name"
            value={fileName}
            onChange={(e) => setFileName(e.target.value)}
            style={{
              padding: "8px",
              width: "220px",
              borderRadius: "5px",
              border: "1px solid #ccc"
            }}
          />
          <br /><br />
          <button
            onClick={downloadVCF}
            style={{
              padding: "10px 20px",
              background: "#25D366",
              color: "#fff",
              border: "none",
              borderRadius: "6px",
              cursor: "pointer",
            }}
          >
            Download Contact File
          </button>
        </>
      )}
    </div>
  );
}