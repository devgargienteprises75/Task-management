import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import type { RootState } from "@/app/app.store";
import { setTheme, type ThemeMode } from "@/app/layout.slice";

export const useTheme = () => {
  const dispatch = useDispatch();
  const theme = useSelector((state: RootState) => state.layout.theme);

  useEffect(() => {
    const root = document.documentElement;

    const applyTheme = () => {
      let isDark = false;
      if (theme === "dark") {
        isDark = true;
      } else if (theme === "system") {
        isDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      } else {
        isDark = false;
      }

      if (isDark) {
        root.classList.add("dark");
      } else {
        root.classList.remove("dark");
      }
    };

    applyTheme();

    if (theme === "system") {
      const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
      const handleChange = () => applyTheme();
      mediaQuery.addEventListener("change", handleChange);
      return () => mediaQuery.removeEventListener("change", handleChange);
    }
  }, [theme]);

  const changeTheme = (newTheme: ThemeMode) => {
    dispatch(setTheme(newTheme));
  };

  return { theme, changeTheme };
};

export default useTheme;
