import { useState, useEffect } from "react";
import SplitPane from "react-split-pane";

import Loader from "./pyodide-loader";
import CodeEditor from "./components/editor";
import NavButtons from "./components/nav-buttons";

function App() {
  const [pythonCode, setPythonCode] = useState(
    "print('https://github.com/TeaByte/python-playground')"
  );
  const [pythonResult, setPythonResult] = useState("");
  const [isError, setIsError] = useState(false);

  const [pyodideLoaded, setPyodideLoaded] = useState(false);
  const [position, setPosition] = useState("horizontal");

  useEffect(() => {
    (async function pyodideLoader() {
      let pyodide = await window.loadPyodide();
      window.pyodide = pyodide;
      console.log(pyodide);
      setPyodideLoaded(true);
      setPythonResult(pyodide.runPython("import sys;sys.version.split()[0]"));
    })();
  }, []);

  function rotate() {
    if (position === "horizontal") {
      setPosition("vertical");
    } else {
      setPosition("horizontal");
    }
  }

  return (
    <main>
      {pyodideLoaded ? (
        <SplitPane
          split={position}
          minSize={100}
          defaultSize="70%"
          className="flex flex-col"
        >
          <section className="w-full h-full">
            {pyodideLoaded ? (
              <NavButtons
                className="flex gap-2 p-2 py-2 bg-[#1E1E1E] items-center justify-center md:justify-start overflow-x-auto"
                setPythonResult={setPythonResult}
                setPythonCode={setPythonCode}
                pythonCode={pythonCode}
                rotate={rotate}
                setIsError={setIsError}
              />
            ) : (
              <p>Loading Pyodide...</p>
            )}
            <CodeEditor setPythonCode={setPythonCode} pythonCode={pythonCode} />
          </section>
          <section className="w-full h-full bg-black">
            <pre
              className={
                "bg-black text-green-400 p-4" + (isError ? "text-red-400" : "")
              }
              style={{ maxHeight: "500px", overflowY: "auto" }}
            >
              {pythonResult}
            </pre>
          </section>
        </SplitPane>
      ) : (
        <Loader />
      )}
    </main>
  );
}

export default App;
