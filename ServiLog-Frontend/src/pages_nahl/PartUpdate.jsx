function PartUpdate() {
  return (
    <div className="w-screen h-screen bg-white flex justify-center items-center font-serif">
      <div className="fixed w-full h-[10%] bg-red-600 top-0"></div>
      <div className="w-1/3 h-2/3 bg-zinc-400 rounded-xl flex flex-col">
        <div className="w-full h-1/4 flex justify-center items-center">
          <p className="text-2xl">Update Part</p>
        </div>
        <div className="w-full h-1/2 flex flex-col justify-center items-center">
          <div className="w-full">
            <div className="w-full p-2 flex flex-col">
              <p>Part ID</p>
              <input type="text" className="w-full px-2 py-0.5 rounded-md" />
            </div>
          </div>
          <div className="w-full flex">
            <div className="w-1/2 p-2 h-full space-y-4">
              <div className="flex flex-col">
                <p>Vehicle ID</p>
                <input type="text" className="px-2 py-0.5 rounded-md" />
              </div>
              <div className="flex flex-col">
                <p>Name</p>
                <input type="text" className="px-2 py-0.5 rounded-md" />
              </div>
              <div className="flex flex-col">
                <p>Brand</p>
                <input type="text" className="px-2 py-0.5 rounded-md" />
              </div>
              <div className="flex flex-col">
                <p>Model</p>
                <input type="text" className="px-2 py-0.5 rounded-md" />
              </div>
            </div>
            <div className="w-1/2 p-2 h-full space-y-4">
              <div className="flex flex-col">
                <p>Year</p>
                <input type="text" className="px-2 py-0.5 rounded-md" />
              </div>
              <div className="flex flex-col">
                <p>Install Mileage</p>
                <input type="text" className="px-2 py-0.5 rounded-md" />
              </div>
              <div className="flex flex-col">
                <p>Lifetime Mileage</p>
                <input type="text" className="px-2 py-0.5 rounded-md" />
              </div>
            </div>
          </div>
        </div>
        <div className="w-full h-1/4 flex justify-center items-center">
          <button className="p-2 bg-[#FECB00] w-auto rounded-md">UPDATE</button>
        </div>
      </div>
    </div>
  );
}

export default PartUpdate;
