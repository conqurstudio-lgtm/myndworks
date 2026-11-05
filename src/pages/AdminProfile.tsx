import { useEffect, useState, type FormEvent } from "react";
import { supabase } from "../lib/supabase";
import "./admin-events.css";

export function AdminProfile() {
  const [allowed, setAllowed] = useState(false);
  const [email, setEmail] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    let active = true;

    async function loadProfile() {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session?.user) {
        window.location.replace("/admin/login");
        return;
      }

      const { data: admin } = await supabase
        .from("admin_users")
        .select("user_id")
        .eq("user_id", session.user.id)
        .maybeSingle();

      if (!admin) {
        await supabase.auth.signOut();
        window.location.replace("/admin/login");
        return;
      }

      if (!active) return;

      setEmail(session.user.email ?? "");
      setAllowed(true);
    }

    loadProfile();

    return () => {
      active = false;
    };
  }, []);

  async function signOut() {
    await supabase.auth.signOut();
    window.location.href = "/admin/login";
  }

  async function changePassword(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setSuccess("");

    if (!email) {
      setError("We could not confirm the signed-in email.");
      return;
    }

    if (newPassword.length < 8) {
      setError("Use at least 8 characters for the new password.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("The new passwords do not match.");
      return;
    }

    if (currentPassword === newPassword) {
      setError("Choose a new password that is different from the current one.");
      return;
    }

    setSaving(true);

    const { error: reauthError } = await supabase.auth.signInWithPassword({
      email,
      password: currentPassword,
    });

    if (reauthError) {
      setError("The current password is incorrect.");
      setSaving(false);
      return;
    }

    const { error: updateError } = await supabase.auth.updateUser({
      password: newPassword,
    });

    if (updateError) {
      setError(updateError.message || "The password could not be changed.");
      setSaving(false);
      return;
    }

    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
    setSuccess("Password changed successfully.");
    setSaving(false);
  }

  if (!allowed) {
    return (
      <main className="mw-admin-auth">
        <div className="mw-admin-loading">Checking access…</div>
      </main>
    );
  }

  return (
    <main className="mw-events-admin-shell">
      <header className="mw-events-admin-header mw-admin-header-v2">
        <a className="mw-admin-brand-link" href="/admin">
          <span className="mw-admin-brand">MyndWorks</span>
        </a>

        <button
          className="mw-admin-signout"
          type="button"
          onClick={signOut}
        >
          Sign out
        </button>
      </header>

      <section className="mw-admin-profile">
        <a className="mw-admin-profile-back" href="/admin">
          <span aria-hidden="true">←</span>
          Back to Admin
        </a>

        <div className="mw-admin-profile-heading">
          <h1>My Account</h1>
          <p>Manage the password for your signed-in MyndWorks admin account.</p>
        </div>

        <div className="mw-admin-profile-card">
          <div className="mw-admin-profile-identity">
            <span>Signed in as</span>
            <strong>{email}</strong>
          </div>

          <div className="mw-admin-profile-divider" />

          <form
            className="mw-admin-profile-form"
            onSubmit={changePassword}
          >
            <div className="mw-admin-profile-form-heading">
              <h2>Change password</h2>
              <p>
                Confirm your current password, then choose a new one.
              </p>
            </div>

            <label>
              <span>Current password</span>
              <input
                type="password"
                autoComplete="current-password"
                required
                value={currentPassword}
                onChange={(event) =>
                  setCurrentPassword(event.target.value)
                }
              />
            </label>

            <label>
              <span>New password</span>
              <input
                type="password"
                autoComplete="new-password"
                minLength={8}
                required
                value={newPassword}
                onChange={(event) =>
                  setNewPassword(event.target.value)
                }
              />
              <small>Minimum 8 characters.</small>
            </label>

            <label>
              <span>Confirm new password</span>
              <input
                type="password"
                autoComplete="new-password"
                minLength={8}
                required
                value={confirmPassword}
                onChange={(event) =>
                  setConfirmPassword(event.target.value)
                }
              />
            </label>

            {error && (
              <div className="mw-admin-profile-message is-error" role="alert">
                {error}
              </div>
            )}

            {success && (
              <div
                className="mw-admin-profile-message is-success"
                role="status"
              >
                {success}
              </div>
            )}

            <button
              className="mw-admin-profile-save"
              type="submit"
              disabled={saving}
            >
              {saving ? "Changing password…" : "Change password"}
            </button>
          </form>
        </div>
      </section>
    </main>
  );
}
