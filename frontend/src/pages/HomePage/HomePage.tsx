import React from "react";
import { Link } from "wouter";

export default function HomePage() {

  return (
    <React.Fragment>
      <Link to="/123">Room 123.</Link>
      I am HomePage.
    </React.Fragment>
  )
}
