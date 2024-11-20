import React, { useState } from 'react'

function SignUp() {

    type formData = {
        email : string;
    }
  
    const [formdata,setFormData] = useState<formData>({email : ""});
  
    const updateForm = (evt : React.ChangeEvent<HTMLInputElement>) =>{
        const {name,value} = evt.target;
        setFormData((currData) => ({...currData , [name] : value}))
    }
    
  
    return (
    <div className='h-[calc(100vh-60px)] w-[100vw] bg-[var(--ternary)] flex items-center justify-center' > 
            <div className='h-fit w-[70vh] bg-[var(--background-2)] rounded-md flex flex-col justify-start items-center gap-4 p-[40px]'>
                <h3 className='text-[var(--secondary)] text-[40px] pb-5 pt-2'>Welcome to Taskera</h3>
                <button className='h-[50px] w-[80%] bg-[var(--ternary)] text-white flex justify-center items-center rounded-[5px]'>
                    <img src="/images/google.png" alt="" className='h-[32px] w-[32px] mr-4'/>Sign up with google
                </button>

                <div className='relative h-2 w-full flex items-center justify-center pt-[23px] pb-[23px]' >
                    <hr className='border-[--secondary] h-[1px] w-[370px]'/>
                    <p className='absolute w-fit h-fit left-1/2 -translate-x-[50%] bg-[--background-2] p-1 text-[--secondary] '>OR</p>
                </div>    

                <input type="text" className='h-[50px] w-[80%] border border-[--secondary] bg-[var(--background-2)] rounded-[5px] p-4 text-[--primary] focus:outline-none' placeholder='Enter your email' name='email' value={formdata.email} onChange={updateForm}/>

                <button className='h-[50px] w-[80%] bg-[var(--secondary)] text-black flex justify-center items-center rounded-[5px]'>Continue with email</button>

                <p className='text-white text-[12px] w-3/4 pt-2'>By continuing, you agree to SSG's Consumer Terms and Usage Policy, 
                and acknowledge their Privacy Policy.</p>


            </div>
    </div>
  )
}

export default SignUp