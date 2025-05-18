function PartsGetByVehicleId() {
  return (
    <div className="w-screen h-screen bg-white flex justify-center items-center font-serif">
      <div className="fixed w-full h-[10%] bg-red-600 top-0"></div>
      <div className="w-3/4 h-2/3 bg-zinc-400 rounded-xl flex flex-col">
        <div className="w-full h-1/4 flex justify-center items-center">
          <p className="text-2xl">Get Parts by Vehicle ID</p>
        </div>
        <div className="w-full h-1/4 flex flex-col justify-center items-center">
          <div className="flex flex-col w-1/4">
            <p>Vehicle ID</p>
            <input type="text" className="px-2 py-0.5 rounded-md" />
          </div>
          <button className="mt-8 p-2 bg-[#FECB00] w-auto rounded-md">
            GET
          </button>
        </div>
        <div className="w-full h-1/2"></div>
      </div>
    </div>
  );
}

export default PartsGetByVehicleId;
