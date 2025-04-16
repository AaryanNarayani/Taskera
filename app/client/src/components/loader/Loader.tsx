import logo from "@/assets/Taskera.png";
function Loader() {
  return (
    <div
      role="status"
      className="absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%]"
    >
      <div className="animate-pulse">
        <img src={logo} alt="" className="h-[200px] w-[200px] object-cover" />
      </div>
    </div>
  );
}

export default Loader;
