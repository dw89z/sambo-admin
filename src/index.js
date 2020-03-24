// import "core-js/stable";
// import "regenerator-runtime/runtime";
// import "react-app-polyfill/ie9";
// import "react-app-polyfill/stable";
// import "url-search-params-polyfill";
import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import "./scss/index.scss";
import jQuery from "jquery/dist/jquery.slim";

window.$ = window.jQuery = jQuery;

ReactDOM.render(<App />, document.getElementById("root"));
