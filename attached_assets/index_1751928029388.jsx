import Layout from "./Layout.jsx";

import Home from "./Home";

import Blog from "./Blog";

import WellnessPicks from "./WellnessPicks";

import BlogPost from "./BlogPost";

import Admin from "./Admin";

import About from "./About";

import Contact from "./Contact";

import WellnessQuiz from "./WellnessQuiz";

import Premium from "./Premium";

import Challenges from "./Challenges";

import Dashboard from "./Dashboard";

import ChallengeDetail from "./ChallengeDetail";

import WellnessPlan from "./WellnessPlan";

import MealPlanner from "./MealPlanner";

import MeditationTimer from "./MeditationTimer";

import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';

const PAGES = {
    
    Home: Home,
    
    Blog: Blog,
    
    WellnessPicks: WellnessPicks,
    
    BlogPost: BlogPost,
    
    Admin: Admin,
    
    About: About,
    
    Contact: Contact,
    
    WellnessQuiz: WellnessQuiz,
    
    Premium: Premium,
    
    Challenges: Challenges,
    
    Dashboard: Dashboard,
    
    ChallengeDetail: ChallengeDetail,
    
    WellnessPlan: WellnessPlan,
    
    MealPlanner: MealPlanner,
    
    MeditationTimer: MeditationTimer,
    
}

function _getCurrentPage(url) {
    if (url.endsWith('/')) {
        url = url.slice(0, -1);
    }
    let urlLastPart = url.split('/').pop();
    if (urlLastPart.includes('?')) {
        urlLastPart = urlLastPart.split('?')[0];
    }

    const pageName = Object.keys(PAGES).find(page => page.toLowerCase() === urlLastPart.toLowerCase());
    return pageName || Object.keys(PAGES)[0];
}

// Create a wrapper component that uses useLocation inside the Router context
function PagesContent() {
    const location = useLocation();
    const currentPage = _getCurrentPage(location.pathname);
    
    return (
        <Layout currentPageName={currentPage}>
            <Routes>            
                
                    <Route path="/" element={<Home />} />
                
                
                <Route path="/Home" element={<Home />} />
                
                <Route path="/Blog" element={<Blog />} />
                
                <Route path="/WellnessPicks" element={<WellnessPicks />} />
                
                <Route path="/BlogPost" element={<BlogPost />} />
                
                <Route path="/Admin" element={<Admin />} />
                
                <Route path="/About" element={<About />} />
                
                <Route path="/Contact" element={<Contact />} />
                
                <Route path="/WellnessQuiz" element={<WellnessQuiz />} />
                
                <Route path="/Premium" element={<Premium />} />
                
                <Route path="/Challenges" element={<Challenges />} />
                
                <Route path="/Dashboard" element={<Dashboard />} />
                
                <Route path="/ChallengeDetail" element={<ChallengeDetail />} />
                
                <Route path="/WellnessPlan" element={<WellnessPlan />} />
                
                <Route path="/MealPlanner" element={<MealPlanner />} />
                
                <Route path="/MeditationTimer" element={<MeditationTimer />} />
                
            </Routes>
        </Layout>
    );
}

export default function Pages() {
    return (
        <Router>
            <PagesContent />
        </Router>
    );
}