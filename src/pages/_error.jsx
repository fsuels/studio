// src/pages/_error.jsx

import React from "react";
import PropTypes from "prop-types";
import Error from "next/error";

const CustomErrorComponent = ({ statusCode }) => <Error statusCode={statusCode} />;

CustomErrorComponent.propTypes = {
  statusCode: PropTypes.number,
};

CustomErrorComponent.getInitialProps = async (contextData) => {
  // Sentry capture removed
  return Error.getInitialProps(contextData);
};

export default CustomErrorComponent;
