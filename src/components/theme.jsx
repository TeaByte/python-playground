import PropTypes from "prop-types";

ThemeInput.propTypes = {
  theme: PropTypes.string.isRequired,
  selectedTheme: PropTypes.string.isRequired,
  handleThemeChange: PropTypes.func.isRequired,
};

export default function ThemeInput({
  theme,
  selectedTheme,
  handleThemeChange,
}) {
  return (
    <input
      type="radio"
      name="theme-buttons"
      className="btn theme-controller join-item"
      aria-label={theme.charAt(0).toUpperCase() + theme.slice(1)}
      value={theme}
      checked={selectedTheme === theme}
      onChange={handleThemeChange}
    />
  );
}
