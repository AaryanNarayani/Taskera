/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from "react";
import { BASE_URL } from "../utils/vars";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import Spinner from "@/components/spinner/Spinner";

function SignUp() {
  type formData = {
    email: string;
  };

  const [formdata, setFormData] = useState<formData>({ email: "" });
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const updateForm = (evt: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = evt.target;
    setFormData((currData) => ({ ...currData, [name]: value }));
  };

  const handleSubmit = async () => {
    if(formdata.email === '') return toast.error('Email is required');
    setIsLoading(true);
    try {
      const response = await axios.post(`${BASE_URL}/api/v1/auth/email`, {
        email: formdata.email,
      });
      console.log(`API sent:`, response.data);
      localStorage.setItem('email',formdata.email);
      toast.success('Otp sent Successfully');
      navigate("/otpPage");
      setIsLoading(false);
    } catch (e : any) {
      toast.error(e.message)
      console.log("Error during sending email :", e);
      setIsLoading(false);
    }
  };


  const handleOauth = () => {
    window.location.href = `${BASE_URL}/api/v1/auth/google`;
  };

  return (
    <div className="h-[calc(100vh-60px)] w-[100vw] bg-[var(--ternary)] flex items-center justify-center">
      <div className=" w-[65vh] bg-[var(--background-2)] rounded-xl flex flex-col justify-start items-center gap-4 p-3 py-10">
        <h3 className="text-[var(--secondary)] text-[40px] ">
          Login  <span className="text-white"></span>
        </h3>
        <button
          className="h-[50px] w-[80%] bg-[var(--ternary)] text-white flex justify-center items-center rounded-[5px]"
          onClick={handleOauth}
        >
          <img
            src="/images/google.png"
            alt=""
            className="h-[32px] w-[32px] mr-4"
          />
          Sign up with google
        </button>

        <div className="relative h-2 w-full flex items-center justify-center pt-[23px] pb-[23px]">
          <hr className="border-[--secondary] h-[1px] w-[370px]" />
          <p className="absolute w-fit h-fit left-1/2 -translate-x-[50%] bg-[--background-2] p-1 text-[--secondary] ">
            OR
          </p>
        </div>

        <input
          type="text"
          className="h-[50px] w-[80%] border border-[--secondary] bg-[var(--background-2)] rounded-[5px] p-4 text-[--primary] focus:outline-none"
          placeholder="Enter your email"
          name="email"
          value={formdata.email}
          onChange={updateForm}
        />
        <p className="text-  text-[10px] w-3/4 pt-2">
          By continuing, you agree to Taskera's Consumer Terms and Usage Policy, and
          acknowledge their Privacy Policy.
        </p>

        <div className="h-[50px] w-[80%] bg-[var(--secondary)] text-black flex justify-center items-center rounded-[5px]">
          {isLoading ? <Spinner/> : <button
          className=" hover:"
          onClick={handleSubmit}
        >
          Continue with email
        </button>}
        </div>

        
      </div>
    </div>
  );
}

export default SignUp;
