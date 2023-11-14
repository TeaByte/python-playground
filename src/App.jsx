import { useState, useEffect } from "react";
import SplitPane from "split-pane-react";
import "split-pane-react/esm/themes/default.css";

import Loader from "./loader";
import CodeEditor from "./components/editor";
import NavButtons from "./components/nav";

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
          <section className="w-full h-full bg-base-200 p-2">
            <div className="mockup-code h-full">
              <pre
                style={{ maxHeight: "500px", overflowY: "auto" }}
                className={
                  "pl-6 pb-4 " + (isError ? "text-error" : "neutral-content")
                }
              >
                {"\n"}
                {pythonResult}
              </pre>
            </div>
          </section>
        </SplitPane>
      ) : (
        <Loader />
      )}
    </main>
  );
}

export default App;
