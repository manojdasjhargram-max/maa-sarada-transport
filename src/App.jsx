import { useState, useRef } from "react";
import "./App.css";
import html2canvas from "html2canvas";
import { collection, addDoc } from "firebase/firestore";
import { db } from "./firebase";

const companies = [
  "FARAKKA",
  "SANKRAIL",
  "OCL",
  "BIRLA",
  "HUB",
  "JSW",
  "ACC",
  "AMBUJA",
  "ULTRATECH",
  "DALMIA",
  "JK CEMENT",
  "RAMCO",
  "NUVOCO",
];

function App() {
  const slipRef = useRef(null);

  const [company, setCompany] = useState("");
  const [date, setDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [vehicle, setVehicle] = useState("");
  const [destination, setDestination] = useState("");
  const [distance, setDistance] = useState("");
  const [hsd, setHsd] = useState("");
  const [cash, setCash] = useState("");
  const [bank, setBank] = useState("");
  const [remarks, setRemarks] = useState("");

  const total =
    (Number(hsd) || 0) +
    (Number(cash) || 0) +
    (Number(bank) || 0);

  const downloadSlip = async () => {
    if (!slipRef.current) return;

    const canvas = await html2canvas(slipRef.current, {
      scale: 2,
      backgroundColor: "#ffffff",
      useCORS: true,
    });

    const link = document.createElement("a");
    link.download = `${vehicle || "Advance"}-${date}.png`;
    link.href = canvas.toDataURL("image/png");
    link.click();
  };

  const handleSave = async () => {
    try {
      await addDoc(collection(db, "advances"), {
        company,
        date,
        vehicle,
        destination,
        distance: Number(distance),
        hsd: Number(hsd),
        cash: Number(cash),
        bank: Number(bank),
        total,
        remarks,
        createdAt: new Date(),
      });

      await downloadSlip();

      alert("Advance Saved Successfully!");

      setCompany("");
      setDate(new Date().toISOString().split("T")[0]);
      setVehicle("");
      setDestination("");
      setDistance("");
      setHsd("");
      setCash("");
      setBank("");
      setRemarks("");
    } catch (err) {
      alert(err.message);
    }
  };return (
    <div className="container">
      <h1>MAA SARADA TRANSPORT</h1>
      <h2>Advance Management System</h2>

      <div className="card">
        <select
          value={company}
          onChange={(e) => setCompany(e.target.value)}
        >
          <option value="">Select Company</option>

          {companies.map((item, index) => (
            <option key={index} value={item}>
              {item}
            </option>
          ))}
        </select>

        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />

        <input
          type="text"
          placeholder="Vehicle Number"
          value={vehicle}
          onChange={(e) => setVehicle(e.target.value.toUpperCase())}
        />

        <input
          type="text"
          placeholder="Destination"
          value={destination}
          onChange={(e) => setDestination(e.target.value.toUpperCase())}
        />

        <input
          type="number"
          placeholder="Distance (KM)"
          value={distance}
          onChange={(e) => setDistance(e.target.value)}
        />

        <input
          type="number"
          placeholder="HSD Advance"
          value={hsd}
          onChange={(e) => setHsd(e.target.value)}
        />

        <input
          type="number"
          placeholder="Cash Advance"
          value={cash}
          onChange={(e) => setCash(e.target.value)}
        />

        <input
          type="number"
          placeholder="Bank Advance"
          value={bank}
          onChange={(e) => setBank(e.target.value)}
        />

        <input
          type="text"
          value={`Total Advance : ₹ ${total}`}
          readOnly
        />

        <textarea
          placeholder="Remarks"
          value={remarks}
          onChange={(e) => setRemarks(e.target.value)}
        />

        <button onClick={handleSave}>
          SAVE ADVANCE
        </button>
      </div>

      <div
        ref={slipRef}
        className="slip"
      >
        <h1>MAA SARADA TRANSPORT</h1>
        <h2>ADVANCE SLIP</h2>

        <hr /><table className="slip-table">
          <tbody>
            <tr>
              <td><b>Company</b></td>
              <td>{company}</td>
            </tr>

            <tr>
              <td><b>Date</b></td>
              <td>{date}</td>
            </tr>

            <tr>
              <td><b>Vehicle No</b></td>
              <td>{vehicle}</td>
            </tr>

            <tr>
              <td><b>Destination</b></td>
              <td>{destination}</td>
            </tr>

            <tr>
              <td><b>Distance</b></td>
              <td>{distance} KM</td>
            </tr>

            <tr>
              <td><b>HSD Advance</b></td>
              <td>₹ {Number(hsd || 0).toLocaleString()}</td>
            </tr>

            <tr>
              <td><b>Cash Advance</b></td>
              <td>₹ {Number(cash || 0).toLocaleString()}</td>
            </tr>

            <tr>
              <td><b>Bank Advance</b></td>
              <td>₹ {Number(bank || 0).toLocaleString()}</td>
            </tr>

            <tr>
              <td>
                <b>Total Advance</b>
              </td>
              <td>
                <b>₹ {total.toLocaleString()}</b>
              </td>
            </tr>

            <tr>
              <td><b>Remarks</b></td>
              <td>{remarks || "-"}</td>
            </tr>
          </tbody>
        </table>

        <hr />

        <div
          style={{
            marginTop: "25px",
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <div>
            ___________________<br />
            Driver Signature
          </div>

          <div style={{ textAlign: "right" }}>
            ___________________<br />
            Authorized Signatory
          </div>
        </div>

        <p
          style={{
            textAlign: "center",
            marginTop: "25px",
            fontSize: "13px",
          }}
        >
          Generated by MAA SARADA TRANSPORT
        </p>
      </div></div>
  );
}

export default App;