import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';

const LandingPage = () => {
    return (
        <div className="min-h-screen bg-theme-bg">
            <Navbar />

            {/* Hero Section */}
            <section className="pt-20 pb-16 md:pt-28 md:pb-24">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-12">
                        <div className="flex-1 text-center md:text-left">                            <h1 className="text-4xl md:text-6xl font-bold font-title text-theme-text mb-6">
                            Welcome to <span className="text-primary">Servi</span><span className="text-secondary">Log</span>
                        </h1>
                            <p className="text-xl md:text-2xl text-theme-text mb-8 font-subtitle italic">
                                Smart Maintenance, Smooth Journey.
                            </p>
                            <p className="text-lg text-theme-text/80 mb-8 font-body">
                                Keep track of your vehicle maintenance with ease. Never miss a service interval again.
                            </p>
                            <Link
                                to="/register"
                                className="inline-block bg-primary text-white px-8 py-3 rounded-lg hover:bg-primary/90 transition-colors font-body"
                            >
                                Get Started
                            </Link>
                        </div>
                        <div className="flex-1">
                            <img
                                src="https://images.unsplash.com/photo-1727893294198-e85137574f5b?w=700&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MjN8fGNhciUyMHNlcnZpY2V8ZW58MHx8MHx8fDA%3D"
                                alt="Vehicle Maintenance Illustration"
                                className="w-full max-w-lg mx-auto rounded-lg shadow-lg"
                            />
                        </div>
                    </div>
                </div>
            </section>

            {/* Benefits Section */}
            <section className="py-16 bg-gray-50 dark:bg-gray-900">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">                    <div className="text-center mb-12">
                    <h2 className="text-3xl md:text-4xl font-bold text-theme-text mb-4 font-title">
                        Why Choose ServiLog?
                    </h2>
                    <p className="text-lg text-theme-text/80 max-w-2xl mx-auto font-body">
                        Experience the benefits of smart vehicle maintenance management
                    </p>
                </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {benefits.map((benefit, index) => (
                            <div
                                key={index}
                                className="p-6 bg-theme-bg rounded-lg shadow-lg hover:shadow-xl transition-shadow"
                            >
                                <div className="w-12 h-12 mb-4 text-primary">
                                    {benefit.icon}
                                </div>                                <h3 className="text-xl font-bold text-theme-text mb-3 font-title">
                                    {benefit.title}
                                </h3>
                                <p className="text-theme-text/80 font-body">
                                    {benefit.description}
                                </p>
                            </div>
                        ))}
                    </div>
                    <div className="text-center mt-12">
                        <Link
                            to="/register"
                            className="inline-block bg-secondary text-gray-900 px-8 py-3 rounded-lg hover:bg-secondary/90 transition-colors font-body"
                        >
                            Get Started Now
                        </Link>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="py-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">                    <div className="text-center mb-12">
                    <h2 className="text-3xl md:text-4xl font-bold text-theme-text mb-4 font-title">
                        Powerful Features
                    </h2>
                    <p className="text-lg text-theme-text/80 max-w-2xl mx-auto font-body">
                        Everything you need to manage your vehicle maintenance effectively
                    </p>
                </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {features.map((feature, index) => (
                            <div
                                key={index}
                                className="p-6 border border-gray-200 dark:border-gray-700 rounded-lg hover:border-primary dark:hover:border-primary transition-colors"
                            >
                                <div className="w-10 h-10 mb-4 text-primary">
                                    {feature.icon}
                                </div>                                <h3 className="text-xl font-bold text-theme-text mb-3 font-title">
                                    {feature.title}
                                </h3>
                                <p className="text-theme-text/80 font-body">
                                    {feature.description}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-gray-50 dark:bg-gray-900">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                        <div className="col-span-1 md:col-span-2">                            <h3 className="text-2xl font-bold text-primary mb-4 font-title"><span className='text-primary'>Servi</span><span className='text-secondary'>Log</span></h3>
                            <p className="text-theme-text/80 mb-4 max-w-md font-body">
                                Smart Maintenance, Smooth Journey. Keep your vehicles in perfect condition with our intelligent maintenance tracking system.
                            </p>
                        </div>
                        <div>                            <h4 className="font-bold text-theme-text mb-4 font-title">Quick Links</h4>
                            <ul className="space-y-2 font-body">
                                <li>
                                    <Link to="/login" className="text-theme-text/80 hover:text-primary">
                                        Login
                                    </Link>
                                </li>
                                <li>
                                    <Link to="/register" className="text-theme-text/80 hover:text-primary">
                                        Register
                                    </Link>
                                </li>
                            </ul>
                        </div>
                        <div>                            <h4 className="font-bold text-theme-text mb-4 font-title">Contact</h4>
                            <ul className="space-y-2 text-theme-text/80 font-body">
                                <li>Email: servilog@gmail.com</li>
                                <li>Devs: Kelompok 27 SBD</li>
                            </ul>
                        </div>
                    </div>                    <div className="border-t border-gray-200 dark:border-gray-700 mt-8 pt-8 text-center text-theme-text/60">
                        <p className="font-body">&copy; {new Date().getFullYear()} ServiLog. All rights reserved.</p>
                    </div>
                </div>
            </footer>
        </div>
    );
};

// Benefits data
const benefits = [
    {
        title: "Smart Notifications",
        description: "Never miss a maintenance schedule with our intelligent notification system",
        icon: (
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
        ),
    },
    {
        title: "Comprehensive Tracking",
        description: "Track all your vehicles and their maintenance history in one place",
        icon: (
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
        ),
    },
    {
        title: "Easy Management",
        description: "Simple and intuitive interface for managing all your maintenance needs",
        icon: (
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
        ),
    },
];

// Features data
const features = [
    {
        title: "Multiple Vehicles",
        description: "Manage multiple vehicles under one account",
        icon: (
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
        ),
    },
    {
        title: "Maintenance History",
        description: "Complete history of all maintenance activities",
        icon: (
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
        ),
    },
    {
        title: "Part Tracking",
        description: "Track the condition and lifetime of vehicle parts",
        icon: (
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
            </svg>
        ),
    },
    {
        title: "Mileage Logging",
        description: "Keep track of vehicle mileage over time",
        icon: (
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
        ),
    },
    {
        title: "Status Updates",
        description: "Real-time updates on vehicle maintenance status",
        icon: (
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
        ),
    },
    {
        title: "Smart Reminders",
        description: "Get notified when maintenance is due",
        icon: (
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
        ),
    },
];

export default LandingPage;