import React from "react";
import { Button, Tooltip } from "antd";

const AntdPage = () => (
  <div className="container">
    <main>
      <h1>Page contains a Antd button</h1>
      <Tooltip title="Click to authorized with GitHub">
        <Button type="primary" size="large">GitHub</Button>
      </Tooltip>
    </main>
    <style jsx>
      {`
        .container {
          min-height: 100vh;
          padding: 0 0.5rem;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
        }

        main {
          padding: 5rem 0;
          flex: 1;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
        }
      `}
    </style>
  </div>
);

export default AntdPage;
