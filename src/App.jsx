import { useState, useEffect, useRef } from "react";
import "./App.css";
import html2canvas from "html2canvas";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

import { db, auth } from "./firebase";
import companies from "./companies";

import {
  collection,
  addDoc,
  getDocs,
} from "firebase/firestore";

import {
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from "firebase/auth";

function App() {
  const slipRef = useRef(null);

  const [user, setUser] = useState(null);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

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

  const [driverName, setDriverName] = useState("");
  const [mobile, setMobile] = useState("");

  const [remarks, setRemarks] = useState("");

  const total =
    (Number(hsd) || 0) +
    (Number(cash) || 0) +
    (Number(bank) || 0);  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });

    return () => unsubscribe();
  }, []);

  const login = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      alert("Login Successful");
    } catch (error) {
      alert(error.message);
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      alert(error.message);
    }
  };

  const downloadSlip = async () => {
    if (!slipRef.current) return;

    const canvas = await html2canvas(slipRef.current, {
      scale: 2,
      backgroundColor: "#ffffff",
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
        driverName,
        mobile,
        remarks,
        createdAt: new Date(),
      });

      await downloadSlip();

      alert("Advance Saved Successfully");

      setCompany("");
      setDate(new Date().toISOString().split("T")[0]);
      setVehicle("");
      setDestination("");
      setDistance("");
      setHsd("");
      setCash("");
      setBank("");
      setDriverName("");
      setMobile("");
      setRemarks("");

    } catch (error) {
      alert(error.message);
    }
  };  const downloadExcel = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "advances"));

      const data = [];

      querySnapshot.forEach((doc) => {
        const d = doc.data();

        data.push({
          Date: d.date,
          Company: d.company,
          Vehicle: d.vehicle,
          Destination: d.destination,
          Distance: d.distance,
          HSD: d.hsd,
          Cash: d.cash,
          Bank: d.bank,
          Total: d.total,
          Driver_Name: d.driverName,
          Mobile_Number: d.mobile,
          Remarks: d.remarks,
        });
      });

      const worksheet = XLSX.utils.json_to_sheet(data);

      const workbook = XLSX.utils.book_new();

      XLSX.utils.book_append_sheet(
        workbook,
        worksheet,
        "Advances"
      );

      const excelBuffer = XLSX.write(workbook, {
        bookType: "xlsx",
        type: "array",
      });

      const file = new Blob([excelBuffer], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });

      saveAs(file, "MAA_SARADA_TRANSPORT_ADVANCE.xlsx");

    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <>
      {!user ? (        <div className="login-card">
          <h1 style={{ whiteSpace: "nowrap" }}>
  MAA SARADA TRANSPORT
</h1>
          <h2>Login</h2>

          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button onClick={login}>LOGIN</button>
        </div>
      ) : (
        <div className="container">

          <div className="card">
            <h1>MAA SARADA TRANSPORT</h1>
            <h2>Advance Management System</h2>

            <p style={{ marginBottom: "15px" }}>
              Welcome : <b>{user.email}</b>
            </p>

            <button onClick={logout}>
              LOGOUT
            </button>

            <br /><br />

            <select
              value={company}
              onChange={(e) => setCompany(e.target.value)}
            >
              <option value="">Select Company</option>

              {companies.map((item) => (
                <option key={item} value={item}>
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
              onChange={(e) =>
                setVehicle(e.target.value.toUpperCase())
              }
            />

            <input
              type="text"
              placeholder="Destination"
              value={destination}
              onChange={(e) =>
                setDestination(e.target.value.toUpperCase())
              }
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
              readOnly
              value={`Total Advance : ₹ ${total.toLocaleString()}`}
            />

            <input
              type="text"
              placeholder="Driver Name"
              value={driverName}
              onChange={(e) =>
                setDriverName(e.target.value.toUpperCase())
              }
            />

            <input
              type="tel"
              placeholder="Mobile Number"
              value={mobile}
              onChange={(e) =>
                setMobile(e.target.value.replace(/\D/g, "").slice(0, 10))
              }
            />

            <textarea
              placeholder="Remarks"
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
            />            <button onClick={handleSave}>
              SAVE ADVANCE
            </button>

            {user?.email === "manojdas.jhargram@gmail.com" && (
              <button
                onClick={downloadExcel}
                style={{
                  marginTop: "10px",
                  backgroundColor: "green",
                  color: "#fff",
                }}
              >
                DOWNLOAD EXCEL
              </button>
            )}
          </div>

          <div ref={slipRef} className="slip">
            <h1>MAA SARADA TRANSPORT</h1>
            <h2>ADVANCE SLIP</h2>

            <table className="slip-table">
              <tbody>
                <tr><td>Company</td><td>{company}</td></tr>
                <tr><td>Date</td><td>{date}</td></tr>
                <tr><td>Vehicle No</td><td>{vehicle}</td></tr>
                <tr><td>Destination</td><td>{destination}</td></tr>
                <tr><td>Distance</td><td>{distance} KM</td></tr>
                <tr><td>HSD Advance</td><td>₹ {hsd || 0}</td></tr>
                <tr><td>Cash Advance</td><td>₹ {cash || 0}</td></tr>
                <tr><td>Bank Advance</td><td>₹ {bank || 0}</td></tr>
                <tr>
                  <td><b>Total Advance</b></td>
                  <td><b>₹ {total}</b></td>
                </tr>
                <tr><td>Driver Name</td><td>{driverName}</td></tr>
                <tr><td>Mobile Number</td><td>{mobile}</td></tr>
                <tr><td>Remarks</td><td>{remarks || "-"}</td></tr>
              </tbody>
            </table>

            <br />

            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginTop: "40px",
              }}
            >
              <div>
                ___________________<br />
                Driver Signature
              <div>
  ___________________<br />
  {user?.email ? user.email.split("@")[0].toUpperCase() : "AUTHORIZED SIGNATORY"}<br />
  Authorized Signature
</div>
            </div>

            <p
              style={{
                textAlign: "center",
                marginTop: "30px",
                fontSize: "12px",
              }}
            >
              Generated by Maa Sarada Transport
            </p>
          </div>
        </div>
      )}
    </>
  );
}

export default App;