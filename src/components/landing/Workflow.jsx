import { CheckCircle2 } from "lucide-react";
import { checklistItems } from "../../constants";
import Image from "next/image";

const Workflow = () => {
  return (
    <div className="mt-20">
      <h2 className="text-3xl sm:text-5xl lg:text-6xl text-center mt-6 tracking-wide">
        Accelerate your{" "}
        <span className="bg-gradient-to-r from-blue-500 to-purple-800 text-transparent bg-clip-text">
          Imagination
        </span>
      </h2>
      <div className="flex flex-wrap justify-center">
        <div className="p-2 w-full lg:w-1/2">
          <Image
            className=""
            src="https://images.unsplash.com/photo-1639759032532-c7f288e9ef4f?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OHx8d2VsbGNvbWUlMjBwdXJwbGV8ZW58MHx8MHx8fDA%3D"
            alt="Picture of the author"
            width={500}
            height={500}
          />
          {/* <Image
              className=""
              src={codeImg}
              alt="Picture of the author"
            /> */}
        </div>
        <div className="pt-12 w-full lg:w-1/2">
          {checklistItems.map((item, index) => (
            <div key={index} className="flex mb-12">
              <div className="text-green-400 mx-6 bg-neutral-900 h-10 w-10 p-2 justify-center items-center rounded-full">
                <CheckCircle2 />
              </div>
              <div>
                <h5 className="mt-1 mb-2 text-xl">{item.title}</h5>
                <p className="text-md text-neutral-500">{item.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Workflow;
