import Button from "./button";
import {
  RunIcon,
  ClearIcon,
  RotateIcon,
  DownloadIcon,
  SettingsIcon,
} from "./icons";
import { useState } from "react";
import PropTypes from "prop-types";
import ThemeSelector from "./themes";

NavButtons.propTypes = {
  rotate: PropTypes.func.isRequired,
  setIsError: PropTypes.func.isRequired,
  setPythonResult: PropTypes.func.isRequired,
  setPythonCode: PropTypes.func.isRequired,
  pythonCode: PropTypes.string.isRequired,
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
      <nav className="flex gap-1 m-2 p-3 rounded-lg bg-neutral items-center justify-center overflow-x-auto">
        <Button onClick={executeCode}>
          <RunIcon />
          Run
        </Button>
        <Button onClick={clearCode} appendclass="btn-outline btn-primary">
          <ClearIcon />
          Clear
        </Button>
        <Button
          onClick={props.rotate}
          appendclass="hidden md:flex btn-outline btn-primary"
        >
          <RotateIcon />
          Rotate
        </Button>
        <div className="drawer drawer-end">
          <input id="my-drawer-4" type="checkbox" className="drawer-toggle" />
          <div className="drawer-content">
            <label
              htmlFor="my-drawer-4"
              className="drawer-button btn btn-primary"
            >
              <SettingsIcon />
            </label>
          </div>
          <div className="drawer-side z-50">
            <label
              htmlFor="my-drawer-4"
              aria-label="close sidebar"
              className="drawer-overlay"
            ></label>
            <ul className="p-4 min-h-full bg-base-200 text-base-content flex flex-col gap-2">
              <li>
                <Button
                  onClick={downloadCode}
                  appendclass="btn-outline btn-info w-full"
                >
                  <DownloadIcon />
                  Download
                </Button>
              </li>
              <li>
                <div className="join">
                  <input
                    className="input input-bordered join-item"
                    type="text"
                    value={pipValue}
                    onChange={(e) => setPipValue(e.target.value)}
                    placeholder="pip install lib"
                  />
                  <button
                    onClick={pipInstall}
                    className="btn btn-primary join-item rounded-r-full"
                  >
                    <DownloadIcon />
                  </button>
                </div>
              </li>
              <ThemeSelector />
            </ul>
          </div>
        </div>
      </nav>
    </>
  );
}
