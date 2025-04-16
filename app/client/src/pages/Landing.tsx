  import { Mail } from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

function Landing() {
  const token = localStorage.getItem("token");
  return (
    <>
      <motion.div
        initial={{ height: 0, width: 0 }}
        animate={{ height: 300, width: 300  }}
        className="bg-[#282d42]  rounded-full absolute -top-24 -left-24 -z-3"
      ></motion.div>
      <div className="flex flex-col mt-[15%] w-[1440px]">
        <div className="w-screen h-screen">
          <div className="w-full h-full flex justify-center items-center flex-col relative">
            <div className="flex flex-col items-center absolute z-10">
              <p className="text-5xl translate-y-8">Welcome to</p>
              <h1 className="flex items-center text-[--secondary] text-[110px] font-medium">
                <img
                  src="/Taskera.png"
                  alt=""
                  className="h-[200px] w-[140px] object-cover"
                />
                <motion.p
                  initial={{opacity : 0, x : 100}}
                  animate={{opacity : 1, x : 0}}
                >Taskera</motion.p>
              </h1>
              <p className="text-[20px] -translate-y-7 translate-x-4">
                Intelligently scheduling your tasks with smart algorithmic
                precision
              </p>
              <Link
                to={token ? "/home" : "/signup"}
                className="border border-[--secondary] text-[--secondary] rounded-md px-4 py-2 hover:bg-[var(--secondary)] hover:text-black"
              >
                Get Started
              </Link>
            </div>

            <motion.img
            initial={{
              rotate:100,
            }}
            animate={{
              rotate:0
            }}
            exit={{
              rotate:100,
            }}
            transition={{
              delay:1,
            }}
            style={{
               translate: '50% 45%'
            }}
              src="/Goodnite.png"
              alt=""
              className="h-[600px] absolute"
            />
            <motion.img
              src="/pomodoro-page.png"
              alt=""
              className="absolute top-[50%] translate-y-[33%]"
              initial={{scale:0, opacity:0}}
              animate={{scale:0.6, opacity:1}}
              transition={{
                duration:1
              }}
            />
          </div>
        </div>
        <div className="h-screen relative">
          <div className="h-[1300px] w-[1300px] bg-[#282d42] absolute rounded-full translate-y-[60%] -translate-x-[20%] flex justify-center items-center">
            <h1 className="text-4xl w-2/3 translate-x-20 inline">
              Effortlessly Transform{" "}
              <p className="text-[--secondary] text-5xl">Complexity </p> into{" "}
              <p className="text-[--secondary] text-5xl">Clarity !!</p>
            </h1>
            <motion.img
              initial={{x:-100}}
              whileInView={{x:0}}
              style={{
               translate: '60% 0%'
            }}
              src="/tasks-page.png"
              alt=""
              className="right-0 absolute h-[600px] translate-x-[60%] translate-y-[0%]"
            />
            <div className="absolute bottom-0 translate-x-[350px] flex flex-col items-center gap-4 mb-10">
              <p className="text-sm">{`Built with love <3  by team CodeSnorters`}</p>
              <div className="flex gap-5">
                <Link
                  to=""
                  className="bg-[#D9D9D9]/20 px-4 py-1 rounded-md flex items-center gap-2"
                >
                  <img src="/github.png" alt="" className="h-6" />
                  Star on GitHub
                </Link>
                <Link
                  to=""
                  className="bg-[#D9D9D9]/20 px-4 py-1 rounded-md flex items-center gap-2"
                >
                  <Mail />
                  Contact Us
                </Link>
              </div>
              <div className="translate-y-10 mb-6 w-screen px-12 flex justify-between items-center">
                <h1 className="text-4xl ">Taskera</h1>
                <div className="flex gap-4">
                  <p>Privacy policy</p>
                  <p>Terms & conditions</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Landing;
