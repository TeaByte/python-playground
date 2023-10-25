import Button from "../button";
import { RunIcon, ClearIcon, RotateIcon, DownloadIcon } from "../icons";

import PropTypes from "prop-types";

NavButtons.propTypes = {
  rotate: PropTypes.func.isRequired,
  setIsError: PropTypes.func.isRequired,
  setPythonResult: PropTypes.func.isRequired,
  setPythonCode: PropTypes.func.isRequired,
  pythonCode: PropTypes.string.isRequired,
  className: PropTypes.string,
};

export default function NavButtons(props) {
  function executeCode() {
    const pythonCode = props.pythonCode;
    const setPythonResult = props.setPythonResult;

    const pythonBlock = `
import sys
from io import StringIO
old_stdout = sys.stdout
sys.stdout = StringIO()
${pythonCode}
result = sys.stdout.getvalue()
result
      `;

    let pyodide = window.pyodide;

    pyodide
      .runPythonAsync(pythonBlock)
      .then((result) => {
        props.setIsError(false);
        console.log("Python => ", result);
        setPythonResult(result);
      })
      .catch((error) => {
        props.setIsError(true);
        console.log("Python => ", error);
        setPythonResult(`${error}`);
      });
  }

  function clearCode() {
    props.setPythonResult("");
    props.setPythonCode("");
  }

  function downloadCode() {
    const pythonCode = props.pythonCode;
    const blob = new Blob([pythonCode], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.download = "code.py";
    link.href = url;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  return (
    <nav className={props.className}>
      <Button onClick={executeCode}>
        <RunIcon />
        Run
      </Button>
      <Button onClick={clearCode}>
        <ClearIcon />
        Clear
      </Button>
      <Button onClick={props.rotate} appendclass="hidden md:flex">
        <RotateIcon />
        Rotate
      </Button>
      <Button onClick={downloadCode}>
        <DownloadIcon />
        Download
      </Button>
    </nav>
  );
}
