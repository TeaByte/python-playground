// This loader will wait for the pyodide package to be loaded
export default function Loader({ text }) {
  return (
    <section className="absolute inset-0 z-10 flex justify-center items-center">
      <div className="flex flex-col justify-center items-center gap-2 bg-primary opacity-90 dark:opacity-100 dark:bg-transparent p-5 rounded-lg">
        <div className="code-loader">
          <span>{"{"}</span>
          <span>{"}"}</span>
        </div>
        <p className="text-2xl">{text}</p>
      </div>
    </section>
  );
}
