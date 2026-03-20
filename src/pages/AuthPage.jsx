function AuthPage({
  authMode,
  onSwitchMode,
  authForm,
  onUpdateAuthForm,
  onSubmitAuth
}) {
  return (
    <section className="page-content">
      <article className="glass-card section-card auth-card">
        <h2>{authMode === "signup" ? "Create Account" : "Login"}</h2>
        <div className="auth-tabs">
          <button
            type="button"
            className={authMode === "login" ? "active" : ""}
            onClick={() => onSwitchMode("login")}
          >
            Login
          </button>
          <button
            type="button"
            className={authMode === "signup" ? "active" : ""}
            onClick={() => onSwitchMode("signup")}
          >
            Signup
          </button>
        </div>
        <form
          className="auth-form"
          onSubmit={(event) => {
            event.preventDefault();
            onSubmitAuth();
          }}
        >
          {authMode === "signup" && (
            <input
              type="text"
              placeholder="Name"
              value={authForm.name}
              onChange={(event) => onUpdateAuthForm("name", event.target.value)}
              required
            />
          )}
          <input
            type="email"
            placeholder="Email"
            value={authForm.email}
            onChange={(event) => onUpdateAuthForm("email", event.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={authForm.password}
            onChange={(event) => onUpdateAuthForm("password", event.target.value)}
            required
          />
          <button type="submit">{authMode === "signup" ? "Create Account" : "Login"}</button>
        </form>
        <button type="button" className="google-btn">
          Continue with Google
        </button>
      </article>
    </section>
  );
}

export default AuthPage;
