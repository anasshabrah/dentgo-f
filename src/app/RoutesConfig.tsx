import React from "react";
import { Routes, Route } from "react-router-dom";
import routes from "./routes";

// recursively render react-router v6 routes from a plain array
export default function RoutesConfig() {
  const renderRoutes = (list) =>
    list.map(({ path, element, children, index }, i) => (
      <Route key={i} path={path} element={element} index={index}>
        {children ? renderRoutes(children) : null}
      </Route>
    ));
  return <Routes>{renderRoutes(routes)}</Routes>;
}