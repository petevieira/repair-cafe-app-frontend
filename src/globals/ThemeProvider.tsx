import React from "react";
import { LightTheme, DarkTheme } from '../themes'

const ThemeContext = React.createContext();

const ThemeProvider = () => {
  state = {
    theme: LightTheme,
    setTheme: (theme) => {
      this.setState({ theme: theme })
    }
  }

  const { theme } = this.state;

  return (
    <ThemeContext.Provider value={this.state} theme={theme}>
      { this.props.children }
    </ThemeContext.Provider>
  )
}

export default ThemeProvider;