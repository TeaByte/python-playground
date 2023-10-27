import Button from "../button";
import { RunIcon, ClearIcon, RotateIcon, DownloadIcon } from "../icons";
import { useState } from "react";
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
  const [pipValue, setPipValue] = useState("");

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

  async function pipInstall() {
    const lib = pipValue.replace("pip install ", "");
    try {
      const micropip = window.micropip;
      await micropip.install(lib);
      props.setPythonResult(`pip install ${lib} successfully installed`);
      props.setIsError(false);
    } catch (e) {
      props.setPythonResult(`Failed to install ${lib}, ${e}`);
      props.setIsError(true);
    }
  }

  return (
    <>
      <nav className={props.className}>
        <Button onClick={executeCode} appendclass="btn-info">
          <RunIcon />
          Run
        </Button>
        <Button onClick={clearCode} appendclass="btn-outline btn-info">
          <ClearIcon />
          Clear
        </Button>
        <Button
          onClick={props.rotate}
          appendclass="hidden md:flex btn-outline btn-info"
        >
          <RotateIcon />
          Rotate
        </Button>
        <Button onClick={downloadCode} appendclass="btn-outline btn-info">
          <DownloadIcon />
          Download
        </Button>
        {/* DESKTOP VIEW */}
        <div className="hidden md:flex gap-1 ml-2 bg-base-200">
          <input
            type="text"
            value={pipValue}
            onChange={(e) => setPipValue(e.target.value)}
            placeholder="pip install ..."
            className="input input-bordered input-info w-[50%] max-w-xs"
          />
          <Button onClick={pipInstall} appendclass="btn-outline btn-info">
            <DownloadIcon />
          </Button>
        </div>
      </nav>
      {/* PHONE VIEW   */}
      <div className="md:hidden flex gap-1 ml-2 bg-base-200 w-full justify-center pb-2">
        <input
          type="text"
          value={pipValue}
          onChange={(e) => setPipValue(e.target.value)}
          placeholder="pip install ..."
          className="input input-bordered input-info w-[50%] max-w-xs"
        />
        <Button onClick={pipInstall} appendclass="btn-outline btn-info">
          <DownloadIcon />
        </Button>
      </div>
    </>
  );
}
