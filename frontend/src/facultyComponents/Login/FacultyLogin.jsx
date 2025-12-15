import React, { useState } from 'react';
import facultyLoginIllustration from '../../assets/faculty-login-illustration.png';
// --- CHANGE 1: useNavigate ko import karein ---
import { Link, useNavigate } from 'react-router-dom';

function FacultyLogin() {
  // --- CHANGE 2: Student login jaisa poora logic add karein ---
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState('');
  const navigate = useNavigate();

  // --- CHANGE 3: Submit function add karein ---
  const submit = async (e) => {
    e.preventDefault();
    setErr('');

    if (!email || !password) {
      setErr('Enter both email and password');
      return;
    }

    setLoading(true);
    try {
      // --- CHANGE 4: YEH SABSE ZAROORI HAI ---
      // URL ko 'teacher/login' endpoint par point karein
      const res = await fetch('http://localhost:5000/api/auth/teacher/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      const data = await res.json();
      if (!res.ok) {
        setErr(data.message || 'Login failed');
        setLoading(false);
        return;
      }
      
      localStorage.setItem('token', data.token);
      // Teacher ko uske dashboard par redirect karein
      navigate('/faculty-dashboard'); 

    } catch (error) {
      console.error(error);
      setErr('Network error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <a href="/"><img className='h-[88px]' src="/logo.png" alt="" /></a>
      <div className='w-[100%] h-[70vh] flex justify-evenly items-center text-font-color flex-wrap'>
        <img className='md:h-[80%] h-[50%] w-auto' src={facultyLoginIllustration} alt="" />
        
        <div className='login flex flex-col gap-10 px-0 '>
          <h2 className='text-[36px] font-manrope font-bold md:text-[54px] md:font-semibold'>Login <span className='text-[22px]'>as faculty</span></h2>
          
          {/* --- CHANGE 5: Form tag mein 'onSubmit' add karein --- */}
          <form className='flex flex-col gap-5 mb-10' onSubmit={submit}>
            {/* Input fields ko state se connect karein */}
            <input
              className='h-[54px] w-12/12 bg-[#f0f0f0] border-0 outline-none rounded-[10px] pl-4 pr-20 font-montserrat'
              type="email" // Type 'email' karein
              placeholder='Email' // Placeholder 'Email' karein
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
            
            {/* --- CHANGE 6: Link ko <button> banayein --- */}
            <button
              type="submit"
              className='bg-accent rounded-[10px] text-white h-[54px] text-center text-[18px] font-manrope font-semibold flex items-center justify-center'
              disabled={loading}
            >
              {loading ? 'Logging in...' : 'Login to Edify'}
            </button>
            
            <Link className=' underline underline-offset-2 font-medium text-[18px]' to="/login">Student Login</Link>
          </form>
        </div>
      </div>
    </div>
  );
}

export default FacultyLogin;