"use client";

import { useState, useEffect } from "react";

import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Resizable } from "@/components/resize";
import Buttons from "@/components/buttons";
import Loader from "@/components/loader";

export default function Home() {
  const [codeString, setCodeString] = useState("print('Hello World')\n");
  const [codeResult, setCodeResult] = useState("");
  const [isError, setIsError] = useState(false);
  const [editorTheme, setEditorTheme] = useState("vs-dark");
  const [direction, setDirection] = useState("vertical");
  const [pyodideLoaded, setPyodideLoaded] = useState(false);
  const [shareID, setShareID] = useState("");

  const [lines, setLines] = useState(1);
  const [words, setWords] = useState(0);
  const [characters, setCharacters] = useState(0);
  const [time, setTime] = useState(0);

  useEffect(() => {
    setLines((prev) => codeString.split("\n").length);
    setWords((prev) => codeString.split(" ").length);
    setCharacters((prev) => codeString.length);
  }, [codeString]);

  useEffect(() => {
    (async function pyodideLoader() {
      const pyodide = await window.loadPyodide();
      await pyodide.loadPackage("micropip");

      const micropip = pyodide.pyimport("micropip");

      window.pyodide = pyodide;
      window.micropip = micropip;

      setPyodideLoaded(true);
      setCodeResult(pyodide.runPython("import sys;sys.version.split()[0]"));

      const urlParams = new URLSearchParams(window.location.search);
      const value = urlParams.get("v");
      try {
        if (value != null) {
          setCodeString(atob(value));
        }
      } catch (e) {
        console.log("Error while decoding: ", e);
      }
    })();
  }, []);

  function rotateCodeFunction() {
    setDirection((prev) => (prev === "vertical" ? "horizontal" : "vertical"));
  }

  function changeEdtiorThemeFunction() {
    setEditorTheme((prev) => (prev === "vs-dark" ? "light" : "vs-dark"));
  }

  function clearCodeFunction() {
    setCodeString("");
    setCodeResult("");
  }

  return (
    <main className="flex flex-col items-center">
      {pyodideLoaded ? (
        <>
          <Buttons
            codeString={codeString}
            setCodeResult={setCodeResult}
            clearCodeFunction={clearCodeFunction}
            rotateCodeFunction={rotateCodeFunction}
            changeEdtiorThemeFunction={changeEdtiorThemeFunction}
            setIsError={setIsError}
            setTime={setTime}
          />
          <Separator className="mb-4" />
          <div className="px-4 w-full flex flex-col h-[750px] mb-4">
            <Resizable
              codeString={codeString}
              codeResult={codeResult}
              setCodeString={setCodeString}
              direction={direction}
              isError={isError}
              editorTheme={editorTheme}
            />
            <section className="text-xs flex justify-around mt-4">
              <div>
                <Badge variant="outline">
                  {lines} Lines, {words} Words
                  <span className="hidden md:inline">
                    <span>, </span> {characters} Characters
                  </span>
                </Badge>
              </div>
              <div>
                <Badge variant="outline">Time {time}s</Badge>
              </div>
            </section>
          </div>
        </>
      ) : (
        <Loader text="Loading WebAssembly" />
      )}
    </main>
  );
}
