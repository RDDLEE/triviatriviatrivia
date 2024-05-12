import { Switch, Route } from "wouter";
import { MantineProvider } from "@mantine/core";
import "@mantine/core/styles.css";
import HomePage from "./pages/HomePage/HomePage";
import "./App.css";
import RoomPage from "./pages/RoomPage/RoomPage";
import RouteUtils from "./lib/RouteUtils";
import MatchStateProvider from "./components/MatchStateProvider/MatchStateProvider";
import theme from "./theme/theme";


export default function App() {
  return (
    <MantineProvider defaultColorScheme="dark" theme={theme}>
      <Switch>
        <Route path={RouteUtils.HOME_PATH} component={HomePage} />
        <MatchStateProvider>
          <Route path={RouteUtils.ROOM_PATH} component={RoomPage} />
        </MatchStateProvider>
        <Route>404: No such page!</Route>
      </Switch>
    </MantineProvider>
  );
}
