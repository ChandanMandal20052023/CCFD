import React, { useState } from 'react';
import loginIllustration from '../../assets/login-illustration.png';
import { Link, useNavigate } from 'react-router-dom';

// --- FIREBASE CHANGE START ---
// Firebase auth ko import karein
import { signInWithCustomToken } from "firebase/auth";
// firebaseConf.js ke import path ko theek kiya gaya hai
import { auth } from "../../firebaseConf.js";
// --- FIREBASE CHANGE END ---


function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState('');
  const navigate = useNavigate();

  // --- FIREBASE CHANGE START ---
  // 'submit' function ko update kiya gaya hai
  const submit = async (e) => {
    e.preventDefault();
    setErr('');

    if (!email || !password) {
      setErr('Enter both email and password');
      return;
    }

    setLoading(true);
    try {
      // 1. Apne MySQL Backend ko call karein (yeh pehle jaisa hai)
      const res = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      const data = await res.json();

      if (!res.ok) {
        // Agar backend se error aaya (e.g., "Invalid credentials")
        throw new Error(data.message || 'Login failed');
      }

      // 2. MySQL Login Successful. MySQL JWT Token save karein.
      localStorage.setItem('token', data.token);

      // 3. Check karein ki Firebase Token mila ya nahi
      if (!data.firebaseToken) {
        throw new Error("Login successful, lekin server ne Firebase token nahi diya.");
      }

      // 4. Firebase mein Custom Token se sign in karein
      console.log("MySQL login successful. Firebase mein login kar rahe hain...");
      await signInWithCustomToken(auth, data.firebaseToken);
      console.log("✅ Firebase login successful!");

      // 5. Jab dono login successful hon, tab navigate karein
      navigate('/MyProfile');

    } catch (error) {
      // Koi bhi error (network, MySQL, ya Firebase) yahaan catch hoga
      console.error("Login process failed:", error);
      setErr(error.message || 'An unknown error occurred.');
    } finally {
      setLoading(false);
    }
  };
  // --- FIREBASE CHANGE END ---

  return (
    <div>
      <a href="/"><img className='h-[88px]' src="/logo.png" alt="" /></a>
      <div className='w-[100%] h-[70vh] flex justify-evenly items-center text-font-color flex-wrap'>
        <img className='md:h-[80%] h-[50%] w-auto' src={loginIllustration} alt="" />
        <div className='login flex flex-col gap-10 px-0'>
          <h2 className='text-[36px] font-manrope font-bold md:text-[54px] md:font-semibold'>
            Login <span className='text-[22px]'>as student</span>
          </h2>
          <form className='flex flex-col gap-5 mb-10' onSubmit={submit}>
            <input
              className='h-[54px] w-12/12 bg-[#f0f0f0] border-0 outline-none rounded-[10px] pl-4 pr-20 font-montserrat'
              type="email"
              placeholder='Email'
              value={email}
              onChange={e => setEmail(e.target.value)}
            />
            <input
              className='h-[54px] w-12/12 bg-[#f0f0f0] border-0 outline-none rounded-[10px] pl-4 pr-20 font-montserrat'
              type="password"
              placeholder='Password'
              value={password}
              onChange={e => setPassword(e.target.value)}
            />
            {err && <div className="text-red-600">{err}</div>}
            <Link className='text-gray-87 font-montserrat underline underline-offset-2 font-medium' to="/">Forgot Password?</Link>
            <button
              type="submit"
              className='bg-accent rounded-[10px] text-white h-[54px] text-center text-[18px] font-manrope font-semibold flex items-center justify-center'
              disabled={loading}
            >
              {loading ? 'Logging in...' : 'Login to Edify'}
            </button>
            <Link className=' underline underline-offset-2 font-medium text-[18px]' to='/faculty-login'>Faculty Login</Link>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Login;

