"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ThemeToggle } from "@/components/theme-button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";

import {
  DownloadIcon,
  Share2Icon,
  FileIcon,
  LoopIcon,
  RotateCounterClockwiseIcon,
} from "@radix-ui/react-icons";

import { RunIcon, ClearIcon, SettingsIcon, MinifierIcon } from "./icons";

export default function Buttons({
  codeString,
  setCodeString,
  setCodeResult,
  clearCodeFunction,
  rotateCodeFunction,
  changeEdtiorThemeFunction,
  setIsError,
  setTime,
}) {
  const [pipValue, setPipValue] = useState("");

  function run() {
    const pythonBlock = `
import sys
from io import StringIO
old_stdout = sys.stdout
sys.stdout = StringIO()
${codeString}
result = sys.stdout.getvalue()
result
      `;

    let pyodide = window.pyodide;

    const startTime = performance.now();
    pyodide
      .runPythonAsync(pythonBlock)
      .then((result) => {
        setIsError(false);
        console.log("Python => ", result);
        setCodeResult(result);
        const endTime = performance.now();
        const elapsedTimeInSeconds = ((endTime - startTime) / 1000).toFixed(4);
        setTime(elapsedTimeInSeconds);
      })
      .catch((error) => {
        setIsError(true);
        console.log("Python => ", error);
        setCodeResult(`${error}`);
        const endTime = performance.now();
        const elapsedTimeInSeconds = ((endTime - startTime) / 1000).toFixed(4);
        setTime(elapsedTimeInSeconds);
      });
  }

  function clearCode() {
    clearCodeFunction();
  }

  function rotate() {
    rotateCodeFunction();
  }

  function downloadCode() {
    const blob = new Blob([codeString], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.download = "code.py";
    link.href = url;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  function shareCode() {
    const urlParams = new URLSearchParams(window.location.search);
    urlParams.set("v", btoa(codeString));
    const newUrl = `${window.location.origin}${
      window.location.pathname
    }?${urlParams.toString()}${window.location.hash}`;
    window.history.replaceState({}, document.title, newUrl);
    navigator.clipboard.writeText(newUrl);
  }

  async function pipInstall() {
    const lib = pipValue.replace("pip install ", "");
    try {
      const micropip = window.micropip;
      await micropip.install(lib);
      setCodeResult(`pip install ${lib} successfully installed`);
      setIsError(false);
    } catch (e) {
      setCodeResult(`Failed to install ${lib}, ${e}`);
      setIsError(true);
    }
  }

  function codeMinifier() {
    const pythonBlock = `import sys
import python_minifier
from io import StringIO
old_stdout = sys.stdout
sys.stdout = StringIO()
with open('minifier.py', 'w') as f:
    f.write(f'''${codeString}''')
with open('minifier.py') as f:
    print(python_minifier.minify(f.read()))
result = sys.stdout.getvalue()
result
    `;

    let pyodide = window.pyodide;
    pyodide
      .runPythonAsync(pythonBlock)
      .then((result) => {
        setIsError(false);
        console.log("Python => ", result);
        setCodeString(result);
      })
      .catch((error) => {
        setIsError(true);
        setCodeResult(`${error}`);
      });
  }

  return (
    <div className="flex items-center gap-2 py-3">
      <Button onClick={run}>
        Run <RunIcon className="w-5 h-5 ml-1" />
      </Button>
      <Button onClick={clearCode}>
        <ClearIcon className={"w-5 h-5"} width={18} height={18} />
      </Button>
      <Button className="hidden md:flex" onClick={rotate}>
        Direction
        <RotateCounterClockwiseIcon className="w-5 h-5 ml-2" />
      </Button>
      <Drawer>
        <DrawerTrigger asChild>
          <Button variant="outline">
            Settings <SettingsIcon className="w-5 h-5 ml-1" />
          </Button>
        </DrawerTrigger>
        <DrawerContent>
          <div className="mx-auto w-full max-w-sm">
            <DrawerHeader>
              <DrawerTitle>Settings</DrawerTitle>
              <DrawerDescription>
                Personalize your site experience here.
              </DrawerDescription>
            </DrawerHeader>
            <div className="p-4 pb-0 flex flex-col gap-3">
              <div className="flex w-full max-w-sm items-center space-x-2">
                <Input
                  value={pipValue}
                  onChange={(e) => setPipValue(e.target.value)}
                  type="text"
                  placeholder="pip install ..."
                />
                <Button onClick={pipInstall} type="submit">
                  <DownloadIcon className="w-5 h-5" />
                </Button>
              </div>
              <Button onClick={shareCode}>
                Share Code <Share2Icon className="w-5 h-5 ml-2" />
              </Button>
              <Button onClick={downloadCode}>
                Download Code <FileIcon className="w-5 h-5 ml-2" />
              </Button>
              <Button onClick={codeMinifier}>
                Code Minifier <MinifierIcon className="w-5 h-5 ml-2" />
              </Button>

              <Button className="flex md:hidden" onClick={rotate}>
                Change Direction
                <RotateCounterClockwiseIcon className="w-5 h-5 ml-2" />
              </Button>
              <Button onClick={changeEdtiorThemeFunction}>
                Change Editor Theme
                <LoopIcon className="w-5 h-5 ml-2" />
              </Button>
            </div>
            <DrawerFooter>
              <DrawerClose asChild>
                <Button variant="outline">Close</Button>
              </DrawerClose>
            </DrawerFooter>
          </div>
        </DrawerContent>
      </Drawer>
      <ThemeToggle />
    </div>
  );
}
