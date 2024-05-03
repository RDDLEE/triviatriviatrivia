import React from "react";
import { Switch, Route } from "wouter";
import HomePage from "./pages/HomePage/HomePage";
import "./App.css";
import RoomPage from "./pages/RoomPage/RoomPage";
import RouteUtils from "./lib/RouteUtils";

export default function App() {
  return (
    <React.Fragment>
      <Switch>
        <Route path={RouteUtils.HOME_PATH} component={HomePage} />
        <Route path={RouteUtils.ROOM_PATH} component={RoomPage} />
        <Route>404: No such page!</Route>
      </Switch>
    </React.Fragment>
  );
}
