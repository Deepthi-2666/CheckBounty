import "./App.css";
import { useState } from "react";

const initialChores = [
  { id: 1, title: "Clean your study table", points: 20, status: "Available", photo: "" },
  { id: 2, title: "Water the plants", points: 10, status: "Available", photo: "" },
  { id: 3, title: "Organize your room", points: 30, status: "Available", photo: "" },
  { id: 4, title: "Help with dinner", points: 25, status: "Available", photo: "" },
];

const styles = {
  page: {
    minHeight: "100vh",
    background: "#f4f5fb",
    fontFamily: "Arial, sans-serif",
    color: "#25233a",
  },
  header: {
    background: "#6c4de6",
    color: "white",
    padding: "18px 24px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    flexWrap: "wrap",
    gap: 12,
  },
  main: {
    maxWidth: 1000,
    margin: "0 auto",
    padding: 24,
  },
  card: {
    background: "white",
    padding: 20,
    borderRadius: 14,
    boxShadow: "0 3px 12px #25233a12",
    marginBottom: 18,
  },
  input: {
    display: "block",
    width: "100%",
    boxSizing: "border-box",
    padding: 12,
    border: "1px solid #d9d7e5",
    borderRadius: 8,
    marginTop: 7,
    marginBottom: 14,
    fontSize: 15,
  },
  button: {
    background: "#6c4de6",
    color: "white",
    padding: "11px 16px",
    border: "none",
    borderRadius: 8,
    cursor: "pointer",
    fontSize: 14,
    fontWeight: "bold",
  },
  secondaryButton: {
    background: "#eee9ff",
    color: "#5436c4",
    padding: "10px 14px",
    border: "none",
    borderRadius: 8,
    cursor: "pointer",
    fontWeight: "bold",
  },
  muted: { color: "#716e84", fontSize: 14 },
};

function App() {
  const [role, setRole] = useState("Parent");
  const [loggedIn, setLoggedIn] = useState(false);
  const [userName, setUserName] = useState("");
  const [loginName, setLoginName] = useState("");
  const [password, setPassword] = useState("");

  const [chores, setChores] = useState(initialChores);
  const [points, setPoints] = useState(0);
  const [newTitle, setNewTitle] = useState("");
  const [newPoints, setNewPoints] = useState("10");
  const [message, setMessage] = useState("");

  const moneyPerPoint = 1;

  function handleLogin(event) {
    event.preventDefault();

    if (!loginName.trim() || !password.trim()) {
      setMessage("Please enter your name and password.");
      return;
    }

    setUserName(loginName.trim());
    setLoggedIn(true);
    setMessage("");
  }

  function addChore(event) {
    event.preventDefault();

    const title = newTitle.trim();
    const value = Number(newPoints);

    if (!title || !Number.isFinite(value) || value <= 0) {
      setMessage("Enter a chore name and a positive points value.");
      return;
    }

    setChores((current) => [
      ...current,
      {
        id: Date.now(),
        title,
        points: Math.floor(value),
        status: "Available",
        photo: "",
      },
    ]);

    setNewTitle("");
    setNewPoints("10");
    setMessage("Chore added successfully!");
  }

  function submitPhoto(choreId, file) {
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setMessage("Please choose an image file.");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setMessage("Please choose an image smaller than 5 MB.");
      return;
    }

    const reader = new FileReader();

    reader.onload = () => {
      setChores((current) =>
        current.map((chore) =>
          chore.id === choreId
            ? { ...chore, photo: reader.result, status: "Pending Review" }
            : chore
        )
      );

      setMessage("Photo submitted! Ask your parent to review it.");
    };

    reader.onerror = () => {
      setMessage("Could not read the photo. Please try again.");
    };

    reader.readAsDataURL(file);
  }

  function reviewChore(choreId, approved) {
    const chore = chores.find((item) => item.id === choreId);

    if (!chore || chore.status !== "Pending Review") return;

    if (approved) {
      setPoints((current) => current + chore.points);

      setChores((current) =>
        current.map((item) =>
          item.id === choreId
            ? { ...item, status: "Approved" }
            : item
        )
      );

      setMessage(
        `Chore approved! ${chore.points} points earned.`
      );
    } else {
      setChores((current) =>
        current.map((item) =>
          item.id === choreId
            ? { ...item, status: "Rejected", photo: "" }
            : item
        )
      );

      setMessage("Submission rejected. The child can try again.");
    }
  }

  function tryAgain(choreId) {
    setChores((current) =>
      current.map((item) =>
        item.id === choreId &&
        (item.status === "Rejected" || item.status === "Available")
          ? { ...item, status: "Available", photo: "" }
          : item
      )
    );

    setMessage("Chore is available for another submission.");
  }

  function logout() {
    setLoggedIn(false);
    setLoginName("");
    setPassword("");
    setUserName("");
    setMessage("");
  }

  const pendingCount = chores.filter(
    (chore) => chore.status === "Pending Review"
  ).length;

  const approvedCount = chores.filter(
    (chore) => chore.status === "Approved"
  ).length;

  if (!loggedIn) {
    return (
      <div style={styles.page}>
        <header style={styles.header}>
          <div>
            <h1 style={{ margin: 0 }}>CheckBounty</h1>
            <p style={{ margin: "6px 0 0" }}>
              Complete chores. Earn rewards.
            </p>
          </div>
        </header>

        <main style={{ ...styles.main, maxWidth: 460 }}>
          <section style={{ ...styles.card, marginTop: 45 }}>
            <h2 style={{ marginTop: 0 }}>Welcome!</h2>
            <p style={styles.muted}>
              Log in to your CheckBounty demo account.
            </p>

            <div style={{ display: "flex", gap: 10, margin: "20px 0" }}>
              <button
                type="button"
                onClick={() => setRole("Parent")}
                style={{
                  ...styles.button,
                  flex: 1,
                  background: role === "Parent" ? "#6c4de6" : "#e8e5f3",
                  color: role === "Parent" ? "white" : "#39344c",
                }}
              >
                Parent
              </button>

              <button
                type="button"
                onClick={() => setRole("Child")}
                style={{
                  ...styles.button,
                  flex: 1,
                  background: role === "Child" ? "#6c4de6" : "#e8e5f3",
                  color: role === "Child" ? "white" : "#39344c",
                }}
              >
                Child
              </button>
            </div>

            <form onSubmit={handleLogin}>
              <label>
                {role} name
                <input
                  style={styles.input}
                  value={loginName}
                  onChange={(event) => setLoginName(event.target.value)}
                  placeholder={role === "Parent" ? "Enter parent name" : "Enter child name"}
                  required
                />
              </label>

              <label>
                Password
                <input
                  style={styles.input}
                  type="password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  placeholder="Enter any demo password"
                  required
                />
              </label>

              <button type="submit" style={{ ...styles.button, width: "100%" }}>
                Log in as {role}
              </button>
            </form>

            <p style={styles.muted}>
              Demo only: any non-empty name and password will work.
              This does not create or verify a real account.
            </p>

            {message && <p role="status">{message}</p>}
          </section>
        </main>
      </div>
    );
  }

  return (
    <div style={styles.page}>
      <header style={styles.header}>
        <div>
          <h1 style={{ margin: 0 }}>CheckBounty</h1>
          <p style={{ margin: "6px 0 0" }}>
            {role} dashboard · Welcome, {userName}!
          </p>
        </div>

        <button
          type="button"
          onClick={logout}
          style={{ ...styles.secondaryButton, background: "white" }}
        >
          Log out
        </button>
      </header>

      <main style={styles.main}>
        {message && (
          <div
            role="status"
            style={{
              ...styles.card,
              borderLeft: "5px solid #6c4de6",
              padding: 14,
            }}
          >
            {message}
            <button
              type="button"
              onClick={() => setMessage("")}
              style={{ ...styles.secondaryButton, marginLeft: 12 }}
            >
              Dismiss
            </button>
          </div>
        )}

        {role === "Parent" ? (
          <>
            <h2>Parent Dashboard</h2>
            <p style={styles.muted}>
              Manage chores and review your child's photo submissions.
            </p>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
                gap: 14,
              }}
            >
              <div style={styles.card}>
                <p style={styles.muted}>Pending submissions</p>
                <h2>{pendingCount}</h2>
              </div>

              <div style={styles.card}>
                <p style={styles.muted}>Approved chores</p>
                <h2>{approvedCount}</h2>
              </div>

              <div style={styles.card}>
                <p style={styles.muted}>Child's earned balance</p>
                <h2>₹{points * moneyPerPoint}</h2>
              </div>
            </div>

            <section style={styles.card}>
              <h3>Add a new chore</h3>

              <form onSubmit={addChore}>
                <label>
                  Chore name
                  <input
                    style={styles.input}
                    value={newTitle}
                    onChange={(event) => setNewTitle(event.target.value)}
                    placeholder="e.g. Feed the pet"
                    required
                  />
                </label>

                <label>
                  Points (1 point = ₹1)
                  <input
                    style={styles.input}
                    type="number"
                    min="1"
                    step="1"
                    value={newPoints}
                    onChange={(event) => setNewPoints(event.target.value)}
                    required
                  />
                </label>

                <button type="submit" style={styles.button}>
                  + Add Chore
                </button>
              </form>
            </section>

            <section>
              <h3>Chore submissions</h3>

              {chores.map((chore) => (
                <article key={chore.id} style={styles.card}>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      gap: 12,
                      flexWrap: "wrap",
                    }}
                  >
                    <div>
                      <h3 style={{ margin: "0 0 8px" }}>{chore.title}</h3>
                      <p style={styles.muted}>
                        {chore.points} points · ₹{chore.points * moneyPerPoint}
                      </p>
                    </div>

                    <strong>{chore.status}</strong>
                  </div>

                  {chore.photo && (
                    <div style={{ margin: "14px 0" }}>
                      <p style={styles.muted}>Submitted photo:</p>
                      <img
                        src={chore.photo}
                        alt={`Photo submitted for ${chore.title}`}
                        style={{
                          display: "block",
                          width: "100%",
                          maxWidth: 320,
                          maxHeight: 260,
                          objectFit: "contain",
                          borderRadius: 10,
                          border: "1px solid #ddd",
                        }}
                      />
                    </div>
                  )}

                  {chore.status === "Pending Review" && (
                    <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                      <button
                        type="button"
                        onClick={() => reviewChore(chore.id, true)}
                        style={{ ...styles.button, background: "#18864b" }}
                      >
                        Approve
                      </button>

                      <button
                        type="button"
                        onClick={() => reviewChore(chore.id, false)}
                        style={{ ...styles.button, background: "#c53b50" }}
                      >
                        Reject
                      </button>
                    </div>
                  )}
                </article>
              ))}
            </section>
          </>
        ) : (
          <>
            <h2>Child Dashboard</h2>
            <p style={styles.muted}>
              Complete your chores, upload photo proof, and earn rewards!
            </p>

            <section style={styles.card}>
              <p style={styles.muted}>Your earned points</p>
              <h2>{points} points</h2>
              <p>
                Reward balance: <strong>₹{points * moneyPerPoint}</strong>
              </p>
              <p style={styles.muted}>
                Your parent must approve a submission before points are added.
              </p>
            </section>

            <h3>Your chores</h3>

            {chores.map((chore) => (
              <article key={chore.id} style={styles.card}>
                <h3 style={{ marginTop: 0 }}>{chore.title}</h3>
                <p style={styles.muted}>
                  Reward: {chore.points} points (₹{chore.points * moneyPerPoint})
                </p>
                <p>
                  Status: <strong>{chore.status}</strong>
                </p>

                {chore.status === "Available" && (
                  <label>
                    Upload a photo showing your completed chore
                    <input
                      style={styles.input}
                      type="file"
                      accept="image/*"
                      onChange={(event) =>
                        submitPhoto(chore.id, event.target.files?.[0])
                      }
                    />
                  </label>
                )}

                {chore.status === "Rejected" && (
                  <button
                    type="button"
                    style={styles.button}
                    onClick={() => tryAgain(chore.id)}
                  >
                    Try Again
                  </button>
                )}

                {chore.status === "Pending Review" && (
                  <p style={styles.muted}>
                    Photo submitted. Waiting for parent approval.
                  </p>
                )}

                {chore.status === "Approved" && (
                  <p style={{ color: "#18864b", fontWeight: "bold" }}>
                    ✓ Approved! You earned {chore.points} points.
                  </p>
                )}
              </article>
            ))}

            <section style={styles.card}>
              <h3>Monthly earnings summary</h3>
              <p>
                Approved points: <strong>{points}</strong>
              </p>
              <p>
                Potential reward amount:{" "}
                <strong>₹{points * moneyPerPoint}</strong>
              </p>
              <p style={styles.muted}>
                This is a demo balance, not a bank transfer or an actual payout.
                Month-end payout scheduling will be added later.
              </p>
            </section>
          </>
        )}
      </main>
    </div>
  );
}

export default App;
