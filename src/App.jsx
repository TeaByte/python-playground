import { useState, useEffect } from "react";
import SplitPane from "split-pane-react";
import "split-pane-react/esm/themes/default.css";

import Loader from "./pyodide-loader";
import CodeEditor from "./components/editor";
import NavButtons from "./components/nav-buttons";

function App() {
  const [pythonCode, setPythonCode] = useState(
    `import snowballstemmer\n
stemmer = snowballstemmer.stemmer('english')
print(stemmer.stemWords('go goes going gone'.split()))

print('https://github.com/TeaByte/python-playground')
    `
  );

  const [pythonResult, setPythonResult] = useState("");
  const [isError, setIsError] = useState(false);

  const [pyodideLoaded, setPyodideLoaded] = useState(false);
  const [position, setPosition] = useState("horizontal");
  const [sizes, setSizes] = useState([100, "9%", "auto"]);

  useEffect(() => {
    (async function pyodideLoader() {
      const pyodide = await window.loadPyodide();
      await pyodide.loadPackage("micropip");
      const micropip = pyodide.pyimport("micropip");
      await micropip.install("snowballstemmer");

      window.pyodide = pyodide;
      window.micropip = micropip;

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
    <main className="bg-base-200" style={{ height: "100vh" }}>
      {pyodideLoaded ? (
        <SplitPane
          className="splitrow"
          split={position}
          sizes={sizes}
          onChange={setSizes}
        >
          <section className="w-full h-full">
            {pyodideLoaded ? (
              <NavButtons
                className="flex gap-2 p-2 py-2 bg-base-200 items-center justify-center md:justify-start overflow-x-auto"
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
          <section className="w-full h-full bg-base-200">
            <pre
              className={
                "bg-base-200 p-4 " + (isError ? "text-error" : "text-success")
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
