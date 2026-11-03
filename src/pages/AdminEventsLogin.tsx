import { useState, type FormEvent } from "react";
import { supabase } from "../lib/supabase";
import myndworksMark from "../assets/myndworks-mark.svg";
import "./admin-events.css";

export function AdminEventsLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setLoading(true);

    const { data, error: signInError } =
      await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });

    if (signInError || !data.user) {
      setError("Incorrect email or password.");
      setLoading(false);
      return;
    }

    const { data: admin, error: adminError } = await supabase
      .from("admin_users")
      .select("user_id")
      .eq("user_id", data.user.id)
      .maybeSingle();

    if (adminError || !admin) {
      await supabase.auth.signOut();
      setError("This account does not have Events admin access.");
      setLoading(false);
      return;
    }

    window.location.href = "/admin";
  }

  return (
    <main className="mw-admin-auth">
      <section className="mw-admin-login-card">
        <div className="mw-admin-login-brand">
          <span className="mw-admin-login-brand-mark">
            <img src={myndworksMark} alt="" />
          </span>
          <span className="mw-admin-brand">MyndWorks</span>
        </div>

        <div className="mw-admin-copy">

          <h1>Welcome back.</h1>
          <p>Sign in to manage MyndWorks content.</p>
        </div>

        <form onSubmit={handleSubmit} className="mw-admin-form">
          <label>
            <span>Email address</span>
            <input
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </label>

          <label>
            <span>Password</span>
            <input
              type="password"
              autoComplete="current-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </label>

          {error && (
            <div className="mw-admin-error" role="alert">
              {error}
            </div>
          )}

          <button type="submit" disabled={loading}>
            {loading ? "Signing in..." : "Sign in"}
          </button>
        </form>

        <a className="mw-admin-back mw-admin-back-button" href="/">Back to MyndWorks</a>
      </section>
    </main>
  );
}
