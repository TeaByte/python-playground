// This loader will wait for the pyodide package to be loaded
export default function Loader() {
  return (
    <section className="absolute inset-0 z-10 flex justify-center items-center bg-[#1E1E1E]">
      <div className="flex flex-col justify-center items-center gap-2">
        <span className="loading loading-spinner h-24 w-24"></span>
        <p className="text-white text-3xl">Loading Pyodide</p>
      </div>
    </section>
  );
}
