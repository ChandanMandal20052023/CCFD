import React from "react";
import heroImg from "./assets/hero-illustration.jpg";
import studentDash from "./assets/student-dash.png";


const LandingPage = () => {
  return (
    <div className="bg-[#000031] text-white max-w-[100vw] flex flex-col scroll-smooth">
      {/* Navbar */}
      <header className="w-[100vw] md:w-full backdrop-blur-lg fixed top-0 left-0 z-50 py-6 px-8 flex justify-between items-center bg-primary-dark">
        <div className="flex items-center space-x-2">
          <img src="/logo-dark-landing.png" alt="InsightFlow Logo" className="w-[5rem]" />
        </div>
        <nav className="hidden lg:flex space-x-8 text-gray-300">
          <a href="#features" className="hover:text-white">Features</a>
          <a href="#demo" className="hover:text-white">Demo</a>
          <a href="#testimonials" className="hover:text-white">Testimonials</a>
          <a href="#footer" className="hover:text-white">Contact</a>
          <a href="https://youtu.be/QgPuTjXyaws" target="_blank
          " className="px-4 py-2 text-sm border border-accent-purple rounded-lg text-accent-purple hover:bg-white hover:text-black transition duration-300">
                   Watch Demo
          </a>
          {/* Take a Tour (Primary CTA - Filled) */}
          <a href="/login" className="px-6 py-2 text-sm border flex flex-row font-semibold bg-accent-purple text-white rounded-lg transition duration-300 shadow-lg shadow-accent-purple/30">
             Take a Tour
                    <svg className="w-5 h-5 ml-2 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path></svg>
          </a>
        </nav>
        <button className="lg:hidden flex flex-col space-y-1">
          <span className="block w-6 h-0.5 bg-white"></span>
          <span className="block w-6 h-0.5 bg-white"></span>
          <span className="block w-6 h-0.5 bg-white"></span>
        </button>
      </header>

      {/* Hero Section */}
      <section className="relative flex flex-col md:flex-row flex-1 h-[100vh] bg-[#000031] items-center justify-between md:py-20 py-32 px-4 md:px-24 lg:py-32">
        {/* Content */}
        <div className="relative z-10 max-w-2xl space-y-6">
          <span className="inline-flex items-center text-sm font-regular text-primary-dark font-montserrat bg-white/50 rounded-full py-1 px-4 border border-primary-dark/30">
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
            Ready to Transform Education?
          </span>
          <h1 className="text-[32px] md:text-[44px] font-manrope lg:text-7xl font-bold leading-tight">
            Simplify Learning Analytics
          </h1>
          <p className="text-[16px] md:text-[18px] text-gray-300">
            InsightFlow helps educators and students understand performance with intuitive dashboards and AI-powered insights.
          </p>
          <div className="flex space-x-4">
            <a
              href="https://youtu.be/QgPuTjXyaws" target="_blank
              "
              className="px-6 py-3 rounded-lg border bg-accent-purple hover:bg-white hover:text-black transition"
            >
              Watch Demo
            </a>
            <a
              href="/login"
              className="px-6 py-3 rounded-lg hover:bg-transparent hover:text-white hover:border bg-white text-[#000031] hover:bg-gray-200 transition"
            >
              Start Tour Now
            </a>
          </div>
        </div>

        {/* Illustration */}
        <div className="md:block relative mt-10">
          <img
            src={heroImg}
            alt="Hero Illustration"
            className="w-[90vw] md:w-[450px] opacity-90 rounded-xl shadow-lg"
          />
        </div>
      </section>

      {/* Demo Section */}
      <section id="demo" className="py-24 px-8 bg-primary-dark">
        <div className="max-w-6xl mx-auto flex flex-col items-center">
          <h2 className="text-[32px] md:text-[44px] font-bold text-left md:text-center mb-4 font-manrope">
            Our Student Portfolio Dashboard UI
          </h2>
          <p className="text-[16px] md:text-[18px] text-gray-400 max-w-3xl mx-auto mb-10 text-left md:text-center">
            A glimpse into the comprehensive, modern, and data-rich dashboard that tracks every student achievement and skill progression.
          </p>
          <img
            src={studentDash}
            alt="Demo Dashboard"
            className="rounded-[5px] md:rounded-[28px] w-[100vw] md:w-[70vw] shadow-lg border border-gray-800"
          />
        </div>
      </section>

 {/* Social Proof Bar from Original Hero Section, reused here for visual break */}
            <div className="mt-0 md:mt-20 flex flex-wrap justify-around items-start text-center border-t border-b border-white/10 py-8 w-full max-w-screen ">
                <div className="w-1/2 sm:w-1/4 p-4">
                    <p className="text-3xl font-bold text-white">1000+</p>
                    <p className="text-sm text-gray-400 mt-1">Colleges Trust Edify</p>
                </div>
                <div className="w-1/2 sm:w-1/4 p-4">
                    <p className="text-3xl font-bold text-white">50K+</p>
                    <p className="text-sm text-gray-400 mt-1">Active Students</p>
                </div>
                <div className="w-1/2 sm:w-1/4 p-4">
                    <p className="text-3xl font-bold text-white">99%</p>
                    <p className="text-sm text-gray-400 mt-1">Compliance Rate</p>
                </div>
                <div className="w-1/2 sm:w-1/4 p-4">
                    <p className="text-3xl font-bold text-white">SOC 2</p>
                    <p className="text-sm text-gray-400 mt-1">Certified Security</p>
                </div>
            </div>
      {/* Features Section */}
      <section id="features" className="py-24 px-8 bg-[#000031]">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-[32px] md:text-[44px] font-bold font-manrope text-left md:text-center mb-4">Core Modules for Modern Education</h2>
          <p className="text-[16px] md:text-[18px] mb-12 text-left md:text-center font-manrope text-gray-400 max-w-3xl mx-auto">
                Smart Student Hub lets colleges, faculty, and students track and showcase achievements in one place.
            </p>
          <div className="grid md:grid-cols-3 gap-8 md:gap-12 mt-0 md:mt-5">
            {/* <!-- Dynamic Student Dashboard --> */}
            <div className="bg-card-bg p-8 rounded-2xl shadow-2xl hover:shadow-accent-purple/20 transition duration-300 border border-[#a0a0a0]">
                <div className="w-12 h-12 flex items-center justify-center rounded-xl bg-accent-purple/20 text-accent-purple mb-4">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h18M3 14h18m-9-4v8m-7-8v8m14-8v8"></path></svg>
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Dynamic Student Dashboard</h3>
                <p className="text-gray-400 text-sm">Real-time updates on academic performance, attendance, and credit-based activities.</p>
            </div>
            {/* <!-- Activity Tracker --> */}
            <div className="bg-card-bg p-8 rounded-2xl shadow-2xl hover:shadow-accent-purple/20 transition duration-300 border border-[#a0a0a0]">
                <div className="w-12 h-12 flex items-center justify-center rounded-xl bg-accent-purple/20 text-accent-purple mb-4">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2m-9 0V3h4v2m-4 0v2"></path></svg>
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Activity Tracker</h3>
                <p className="text-gray-400 text-sm">Upload and validate participation in seminars, courses, internships, and extra-curriculars.</p>
            </div>
            {/* <!-- Activity Approval Panel --> */}
            <div className="bg-card-bg p-8 rounded-2xl shadow-2xl hover:shadow-accent-purple/20 transition duration-300 border border-[#a0a0a0]">
                <div className="w-12 h-12 flex items-center justify-center rounded-xl bg-accent-purple/20 text-accent-purple mb-4">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Activity Approval Panel</h3>
                <p className="text-gray-400 text-sm">Our OQR system validates 99% compliance seamlessly and generates a complete portfolio.</p>
            </div>
            {/* <!-- AI Assignment Checker --> */}
            <div className="bg-card-bg p-8 rounded-2xl shadow-2xl hover:shadow-accent-purple/20 transition duration-300 border border-[#a0a0a0]">
                <div className="w-12 h-12 flex items-center justify-center rounded-xl bg-accent-purple/20 text-accent-purple mb-4">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.586a2 2 0 012.828 0L19 7.172v1.828h-3.586l-2.828-2.828A2 2 0 0115.414 5H11z"></path></svg>
                </div>
                <h3 className="text-xl font-bold text-white mb-2">AI Assignment Checker</h3>
                <p className="text-gray-400 text-sm">An AI-powered model that checks assignments and ensures academic integrity.</p>
            </div>
            {/* <!-- Smart Scheduling --> */}
            <div className="bg-card-bg p-8 rounded-2xl shadow-2xl hover:shadow-accent-purple/20 transition duration-300 border border-[#a0a0a0]">
                <div className="w-12 h-12 flex items-center justify-center rounded-xl bg-accent-purple/20 text-accent-purple mb-4">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Smart Scheduling</h3>
                <p className="text-gray-400 text-sm">Organized timetables and calendar management integrated with curriculum planning.</p>
            </div>
            {/* <!-- Secure Platform --> */}
            <div className="bg-card-bg p-8 rounded-2xl shadow-2xl hover:shadow-accent-purple/20 transition duration-300 border border-[#a0a0a0]">
                <div className="w-12 h-12 flex items-center justify-center rounded-xl bg-accent-purple/20 text-accent-purple mb-4">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg>
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Secure Platform</h3>
                <p className="text-gray-400 text-sm">Enterprise-grade security and data protection complying with all global standards.</p>
            </div>
          </div>
        </div>
      </section>

{/* <!-- Community/Testimonials Section (Reference img24.jpg style) --> */}
    <section id="testimonials" className="py-24 bg-primary-dark">
        <div className="max-w-7xl mx-auto md:px-4 px-8">
            <div className="text-left md:text-center mb-16">
                <h2 className="text-[32px] md:text-[44px] font-bold font-manrope text-white">
                    What Our Community <span className="text-accent-teal">Says About Edify</span>
                </h2>
                <p className="mt-4 text-lg font-manrope text-gray-400 max-w-3xl mx-auto">
                    Join thousands of educators, students, and parents who have transformed their educational experience with Edify.
                </p>
            </div>

            {/* <!-- Testimonials Grid --> */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* <!-- Helper component for 5 star rating --> */}
                <div className="hidden" id="five-stars">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.178 3.61c.19.584.735.97 1.364.97h3.8a1 1 0 01.554 1.705l-3.085 2.234c-.456.33-.655.908-.5 1.458l1.178 3.61c.3.921-.755 1.688-1.54 1.105l-3.085-2.234c-.456-.33-1.096-.33-1.552 0l-3.085 2.234c-.785.583-1.84-.184-1.54-1.105l1.178-3.61c.155-.55.034-1.128-.422-1.458L3.25 9.212a1 1 0 01.554-1.705h3.8c.63 0 1.175-.386 1.364-.97l1.178-3.61z"></path></svg>
                </div>

                {/* <!-- Testimonial Card 1 --> */}
                <div className="bg-card-bg p-6 rounded-2xl shadow-2xl hover:shadow-white/10 transition duration-300 border border-white/10">
                    <div className="flex text-yellow-400 mb-4 space-x-1">
                        <div id="five-stars">⭐</div>
                       {/* Repeat 5 times */}
                        <div>
                          {Array(4).fill(null).map((_, i) => (
                            <span key={i}>⭐</span>
                          ))}
                        </div>
                        </div>
                    <p className="text-gray-200 italic mb-6">"Implementing Edify across our district was the best decision we've made. The comprehensive analytics and reporting capabilities have helped us make data-driven decisions that benefit all our students."</p>
                    <div className="flex items-center">
                        <span className="w-10 h-10 border flex items-center justify-center rounded-full bg-accent-purple text-white font-bold text-lg mr-3 shadow-md">AM</span>
                        <div>
                            <p className="font-semibold font-manrope text-white">Dr. Akhilesh Mishra</p>
                            <p className="text-sm font-manrope text-gray-400">Superintendent, College District</p>
                        </div>
                    </div>
                </div>

                {/* <!-- Testimonial Card 2 --> */}
                <div className="bg-card-bg p-6 rounded-2xl shadow-2xl hover:shadow-white/10 transition duration-300 border border-white/10">
                    <div className="flex text-yellow-400 mb-4 space-x-1">
                        <div id="five-stars">⭐</div>
                       {/* Repeat 5 times */}
                        <div>
                          {Array(4).fill(null).map((_, i) => (
                            <span key={i}>⭐</span>
                          ))}
                        </div>
                        </div>
                    <p className="text-gray-200 italic mb-6">"The technical implementation was seamless, and the learning material is exceptional. Edify accelerates performance in our training rooms, and the security feature give us complete peace of mind."</p>
                    <div className="flex items-center">
                        <span className="w-10 h-10 border flex items-center justify-center rounded-full bg-accent-teal text-white font-bold text-lg mr-3 shadow-md">FK</span>
                        <div>
                            <p className="font-semibold font-manrope text-white">Fatima Khan</p>
                            <p className="text-sm font-manrope text-gray-400">Head of Technology, XYZ College</p>
                        </div>
                    </div>
                </div>

                {/* <!-- Testimonial Card 3 --> */}
                <div className="bg-card-bg p-6 rounded-2xl shadow-2xl hover:shadow-white/10 transition duration-300 border border-white/10">
                    <div className="flex text-yellow-400 mb-4 space-x-1">
                        <div id="five-stars">⭐</div>
                       {/* Repeat 5 times */}
                        <div>
                          {Array(4).fill(null).map((_, i) => (
                            <span key={i}>⭐</span>
                          ))}
                        </div>
                        </div>
                    <p className="text-gray-200 italic mb-6">"Edify has revolutionized how we manage our college. The AI-powered analytics give us insights we never had before. Students love the intuitive interface. We are reporting performance improvements by 40% since implementation."</p>
                    <div className="flex items-center">
                        <span className="w-10 h-10 flex border items-center justify-center rounded-full bg-accent-purple text-white font-bold text-lg mr-3 shadow-md">RD</span>
                        <div>
                            <p className="font-semibold font-manrope text-white">Rahul Dwivedi</p>
                            <p className="text-sm font-manrope text-gray-400">College Principal, ABCE College</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* <!-- Stats Bar (Bottom of img24.jpg) --> */}
            <div className="mt-20 pt-10 border-t border-white/10 flex flex-wrap justify-center text-center">
                <div className="w-1/2 md:w-1/4 p-4 font-manrope">
                    <p className="text-5xl font-semibold text-accent-teal font-montserrat">4.9/5</p>
                    <p className="text-sm text-gray-400 mt-2">Average Rating</p>
                </div>
                <div className="w-1/2 md:w-1/4 p-4 font-manrope">
                    <p className="text-5xl font-semibold text-accent-teal font-montserrat">10K+</p>
                    <p className="text-sm text-gray-400 mt-2">Happy Colleges</p>
                </div>
                <div className="w-1/2 md:w-1/4 p-4 font-manrope">
                    <p className="text-5xl font-semibold text-accent-teal font-montserrat">2M+</p>
                    <p className="text-sm text-gray-400 mt-2">Active Users</p>
                </div>
                <div className="w-1/2 md:w-1/4 p-4 font-manrope">
                    <p className="text-5xl font-semibold text-accent-teal font-montserrat">98%</p>
                    <p className="text-sm text-gray-400 mt-2">Satisfaction Rate</p>
                </div>
            </div>
        </div>
    </section>

{/* <!-- Final CTA Banner (Replicating img25 Hero Section style) --> */}
    <section className="bg-accent-purple py-20 overflow-hidden relative">
        <div className="relative max-w-7xl mx-auto md:px-4 px-8 text-left md:text-center z-10">
            <h2 className="font-manrope text-[32px] md:text-[44px] font-semibold leading-tight mb-4 text-white">
                <span className="block">Join Edify Today &</span>
                <span className="block text-primary-dark">Revolutionize Learning</span>
            </h2>

            <div className="mt-10 flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
                <a href="/login" className="group px-8 py-4 text-lg font-semibold bg-primary-dark text-white rounded-xl hover:bg-white hover:text-black transition duration-300 shadow-2xl shadow-primary-dark/50 flex items-center justify-center">
                    Start Tour Now
                    <svg className="w-5 h-5 ml-2 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path></svg>
                </a>
                <a href="https://youtu.be/QgPuTjXyaws" target="_blank
                " className="px-8 py-4 text-lg font-semibold border border-primary-dark/50 text-primary-dark rounded-xl hover:bg-white/10 transition duration-300 flex items-center justify-center">
                    Watch Demo
                </a>
            </div>
        </div>
    </section>

   {/* <!-- Footer Section (Darkest background from img25.jpg) --> */}
    <footer id="footer" className="bg-footer-dark font-manrope pt-16 pb-8 text-gray-400">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 md:grid-cols-5 gap-10 border-b border-white/10 pb-10">

                {/* <!-- Col 1: Logo & Mission --> */}
                <div className="col-span-2 md:col-span-2">
                    <a href="#" className="text-3xl font-extrabold tracking-tight flex items-center text-white mb-4">
                        <img className="w-[7rem]" src="/logo-dark-landing.png" alt="" />
                    </a>
                    <p className="text-sm max-w-sm mb-6">Empowering education through smart technology. Making learning accessible, engaging, and effective for everyone.</p>

                    <p className="flex items-center text-sm mb-2"><svg className="w-4 h-4 mr-2 text-accent-teal" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>hello@edify.education</p>
                    <p className="flex items-center text-sm mb-2"><svg className="w-4 h-4 mr-2 text-accent-teal" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path></svg>+91-123-4567</p>
                    <p className="flex items-center text-sm"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="lucide lucide-map-pin-icon lucide-map-pin"><path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0"/><circle cx="12" cy="10" r="3"/></svg> &nbsp; Jammu & Kashmir, India</p>
                </div>

                {/* <!-- Col 2: Product --> */}
                <div>
                    <h4 className="text-white font-semibold mb-4">Product</h4>
                    <ul className="space-y-2 text-sm">
                        <li><a href="#features" className="hover:text-accent-purple transition">Features</a></li>
                        <li><a href="#" className="hover:text-accent-purple transition">Pricing</a></li>
                        <li><a href="#" className="hover:text-accent-purple transition">Demo</a></li>
                        <li><a href="#" className="hover:text-accent-purple transition">Integrations</a></li>
                    </ul>
                </div>

                {/* <!-- Col 3: Company & Support --> */}
                <div>
                    <h4 className="text-white font-semibold mb-4">Company</h4>
                    <ul className="space-y-2 text-sm">
                        <li><a href="#about" className="hover:text-accent-purple transition">About Us</a></li>
                        <li><a href="#" className="hover:text-accent-purple transition">Careers</a></li>
                        <li><a href="#" className="hover:text-accent-purple transition">Blog</a></li>
                        <li><a href="#" className="hover:text-accent-purple transition">Press</a></li>
                    </ul>
                </div>

                {/* <!-- Col 4: Stay Updated --> */}
                <div className="col-span-2 md:col-span-1">
                    <h4 className="text-white font-semibold mb-4">Stay Updated</h4>
                    <p className="text-sm mb-4">Get the latest news and updates about Edify's features and educational insights.</p>
                    <div className="flex">
                        <input type="email" placeholder="Enter your email" className="p-3 rounded-l-lg w-full bg-white/10 border-none focus:ring-accent-purple focus:ring-1 text-sm text-white" />
                        <button className="px-4 py-3 bg-accent-purple text-black rounded-r-lg bg-white transition text-sm font-semibold whitespace-nowrap">Subscribe</button>
                    </div>
                    <p className="text-xs mt-3 text-gray-500">By subscribing, you agree to our Privacy Policy and consent to receive updates.</p>

                    {/* <!-- Social Media Links --> */}
                    <h4 className="text-white font-semibold mt-6 mb-3">Follow Us</h4>
                    <div className="flex space-x-3">
                        {/* <!-- Placeholder Icons (Instagram, Twitter, LinkedIn, Facebook) --> */}
                        <a href="#" aria-label="Instagram" className="p-2 bg-white/10 rounded-full hover:bg-accent-purple transition"><svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm3.5 12.5c-.828 0-1.5-.672-1.5-1.5s.672-1.5 1.5-1.5 1.5.672 1.5 1.5-.672 1.5-1.5 1.5zM12 9c-1.657 0-3 1.343-3 3s1.343 3 3 3 3-1.343 3-3-1.343-3-3-3z"></path></svg></a>
                        <a href="#" aria-label="Twitter" className="p-2 bg-white/10 rounded-full hover:bg-accent-purple transition"><svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M22.258 4.743a5.55 5.55 0 01-1.554.423 2.87 2.87 0 001.272-.647 5.748 5.748 0 01-1.815.694 2.875 2.875 0 00-4.88 2.62A8.18 8.18 0 013.91 4.78a2.87 2.87 0 00.887 3.84 2.866 2.866 0 01-1.298-.358v.036c0 2.583 1.838 4.74 4.28 5.232a2.868 2.868 0 01-1.29.049c.677 2.15 2.64 3.712 4.97 3.755A5.768 5.768 0 016.5 18.25c-1.396 0-2.69-.81-3.616-2.193a8.13 8.13 0 004.383 1.284c5.258 0 8.125-4.35 8.125-8.125v-.366a5.772 5.772 0 001.423-1.472"></path></svg></a>
                        <a href="#" aria-label="LinkedIn" className="p-2 bg-white/10 rounded-full hover:bg-accent-purple transition"><svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M16 8a6 6 0 00-6-6 6 6 0 00-6 6v7H3v-7a9 9 0 019-9 9 9 0 019 9v7h-3v-7zM7 17H4v-7h3v7z"></path></svg></a>
                        <a href="#" aria-label="Facebook" className="p-2 bg-white/10 rounded-full hover:bg-accent-purple transition"><svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.016a10 10 0 00-3 19.467v-7.904H6.848V11.51H9.17V9.752c0-2.26 1.35-3.52 3.415-3.52 1.002 0 2.052.178 2.052.178v2.246h-1.157c-1.134 0-1.49.704-1.49 1.425v1.89h2.518l-.403 2.887H12.003v7.904A10 10 0 0012 2.016z"></path></svg></a>
                    </div>
                </div>
            </div>

            {/* <!-- Copyright and Legal Links --> */}
            <div className="flex flex-col md:flex-row justify-between items-center mt-8 space-y-4 md:space-y-0 text-sm">
                <p>&copy; 2025 Edify. All rights reserved. Made with <span className="text-red-500">♥</span> from CODE CRUSHERS.</p>
                <div className="flex space-x-6">
                    <a href="#" className="hover:text-accent-purple transition">Cookie Policy</a>
                    <a href="#" className="hover:text-accent-purple transition">Accessibility</a>
                    <a href="#" className="hover:text-accent-purple transition">Sitemap</a>
                </div>
            </div>

            {/* <!-- Certification Badges --> */}
            <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 mt-6 text-xs font-medium">
                <span className="flex items-center text-green-400"><svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path></svg>SOC 2 Type II Certified</span>
                <span className="flex items-center text-blue-400"><svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path></svg>GDPR Compliant</span>
                <span className="flex items-center text-purple-400"><svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path></svg>FERPA Compliant</span>
                <span className="flex items-center text-yellow-400"><svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path></svg>ISO 27001 Certified</span>
            </div>
        </div>
    </footer>
    </div>
  );
};

export default LandingPage;
