import { createTheme, Title, Text } from "@mantine/core";
import StyleUtils from "../lib/StyleUtils";

const theme = createTheme({
  components: {
    Text: Text.extend({
      defaultProps: {
        c: StyleUtils.THEME_CONFIG.textColor,
      },
    }),
    Title: Title.extend({
      defaultProps: {
        c: StyleUtils.THEME_CONFIG.titleColor,
      },
    }),
  }
});

export default theme;