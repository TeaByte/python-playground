import { useState, useEffect } from "react";
import ThemeInput from "./theme";

export default function ThemeSelector() {
  const [selectedTheme, setSelectedTheme] = useState("default");

  const handleThemeChange = (event) => {
    const newTheme = event.target.value;
    setSelectedTheme(newTheme);
    localStorage.setItem("selectedTheme", newTheme);
  };

  useEffect(() => {
    const storedTheme = localStorage.getItem("selectedTheme");
    if (storedTheme) {
      setSelectedTheme(storedTheme);
      document.documentElement.setAttribute("data-theme", storedTheme);
    }
  }, []);

  const themes = [
    "dark",
    "light",
    "cupcake",
    "synthwave",
    "retro",
    "cyberpunk",
    "valentine",
    "halloween",
    "forest",
    "aqua",
    "dracula",
    "coffee",
    "dim",
    "sunset",
  ];

  return (
    <li className="flex flex-col">
      <div className="join join-vertical border">
        {themes.map((theme) => (
          <ThemeInput
            key={theme}
            theme={theme}
            handleThemeChange={handleThemeChange}
            selectedTheme={selectedTheme}
          />
        ))}
      </div>
    </li>
  );
}
