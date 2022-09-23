import React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

import Nav from "./components/Nav";
import io from "socket.io-client";

import Home from "./views/Home";
import OpenDoor from "./views/OpenDoor";
import NotFound from "./views/NotFound";
export const globalData = {
  sio: "114.115.247.94:3000",
  socket: io("114.115.247.94:3000", { transports: ["websocket"] }),
  id: "",
};

const App = () => {
  return (
    <Router>
      <Nav />
      <Switch>
        <Route exact path="/">
          <Home />
        </Route>
        <Route path="/opendoor">
          <OpenDoor />
        </Route>
        <Route>
          <NotFound />
        </Route>
      </Switch>
    </Router>
  );
};

export default App;
