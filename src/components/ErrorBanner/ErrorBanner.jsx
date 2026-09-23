function ErrorBanner({ type = "error", message }) {
    if (!message) return null;

    const style =
        type === "success"
            ? { color: "#059669", backgroundColor: "#d1fae5" }
            : { color: "#dc2626", backgroundColor: "#fee2e2" };

    return (
        <p className="error-banner" style={{ ...style, fontWeight: 600, padding: "10px 12px", borderRadius: 8, marginBottom: 16 }}>
            {message}
        </p>
    );
}

export default ErrorBanner;