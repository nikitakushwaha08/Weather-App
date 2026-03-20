function AppFooter() {
  return (
    <footer className="app-footer">
      <div className="footer-inner">
        <p>SkyCast © {new Date().getFullYear()}</p>
        <nav aria-label="Footer links">
          <a href="#about">About</a>
          <a href="#contact">Contact</a>
          <a href="#privacy">Privacy Policy</a>
          <a href="https://x.com" target="_blank" rel="noreferrer">
            Social
          </a>
        </nav>
      </div>
    </footer>
  );
}

export default AppFooter;
