import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Leaf, 
  Sparkles, 
  ArrowRight, 
  Play, 
  Heart, 
  Brain, 
  ShoppingBag, 
  Users,
  Star,
  Crown,
  Check
} from "lucide-react";
import { motion } from "framer-motion";

export default function Landing() {
  return (
    <div className="min-h-screen bg-sage-25">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-sm border-b border-sage-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-sage-500 to-sage-600 rounded-xl flex items-center justify-center">
                <Leaf className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold text-sage-700">Pure Living Pro</span>
            </div>
            <div className="hidden md:flex items-center space-x-8">
              <a href="#home" className="text-sage-700 hover:text-sage-500 transition-colors">Home</a>
              <a href="#blog" className="text-sage-600 hover:text-sage-500 transition-colors">Blog</a>
              <a href="#products" className="text-sage-600 hover:text-sage-500 transition-colors">Wellness Picks</a>
              <a href="#premium" className="text-sage-600 hover:text-sage-500 transition-colors">Premium</a>
              <Button 
                onClick={() => window.location.href = "/api/login"}
                className="bg-sage-600 hover:bg-sage-700 text-white"
              >
                <Users className="w-4 h-4 mr-2" />
                Sign In
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section id="home" className="pt-24 pb-16 wellness-gradient hero-pattern">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center lg:text-left"
            >
              <Badge className="bg-sage-100 text-sage-700 mb-6">
                <Sparkles className="w-4 h-4 mr-2" />
                Your Wellness Journey Starts Here
              </Badge>
              <h1 className="text-4xl md:text-6xl font-bold text-sage-800 mb-6 leading-tight">
                Transform Your Life with{" "}
                <span className="text-transparent bg-gradient-to-r from-sage-600 to-earth-500 bg-clip-text">
                  Pure Living
                </span>
              </h1>
              <p className="text-xl text-sage-600 mb-8 max-w-2xl">
                Discover personalized wellness content, expert-curated products, and AI-powered recommendations to support your holistic health journey.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Button 
                  size="lg"
                  onClick={() => window.location.href = "/api/login"}
                  className="bg-sage-600 hover:bg-sage-700 text-white px-8 py-4 text-lg font-semibold transition-all transform hover:scale-105 premium-shadow"
                >
                  <ArrowRight className="w-5 h-5 mr-2" />
                  Start Your Journey
                </Button>
                <Button 
                  size="lg"
                  variant="outline"
                  className="border-2 border-sage-600 text-sage-600 hover:bg-sage-50 px-8 py-4 text-lg font-semibold"
                >
                  <Play className="w-5 h-5 mr-2" />
                  Watch Demo
                </Button>
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative"
            >
              <div className="relative animate-pulse">
                <img 
                  src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=600" 
                  alt="Peaceful meditation scene in nature" 
                  className="rounded-3xl shadow-2xl w-full h-auto" 
                />
                <div className="absolute -top-4 -right-4 bg-white rounded-2xl p-4 premium-shadow">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                    <span className="text-sm font-medium text-sage-700">Live Session</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Overview */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-sage-800 mb-4">
              Everything You Need for Wellness
            </h2>
            <p className="text-xl text-sage-600 max-w-3xl mx-auto">
              From personalized content to expert-curated products, we provide comprehensive tools for your wellness transformation.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="bg-sage-50 rounded-2xl p-6 card-hover"
            >
              <div className="w-12 h-12 bg-sage-600 rounded-xl flex items-center justify-center mb-4">
                <Brain className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-sage-800 mb-2">AI-Powered Insights</h3>
              <p className="text-sage-600">Personalized recommendations based on your wellness profile and goals.</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="bg-earth-50 rounded-2xl p-6 card-hover"
            >
              <div className="w-12 h-12 bg-earth-600 rounded-xl flex items-center justify-center mb-4">
                <ShoppingBag className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-sage-800 mb-2">Curated Products</h3>
              <p className="text-sage-600">Expert-selected wellness products with detailed reviews and research.</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="bg-green-50 rounded-2xl p-6 card-hover"
            >
              <div className="w-12 h-12 bg-green-600 rounded-xl flex items-center justify-center mb-4">
                <Heart className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-sage-800 mb-2">Wellness Tracking</h3>
              <p className="text-sage-600">Monitor your progress with comprehensive wellness analytics and insights.</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="bg-amber-50 rounded-2xl p-6 card-hover"
            >
              <div className="w-12 h-12 bg-amber-600 rounded-xl flex items-center justify-center mb-4">
                <Users className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-sage-800 mb-2">Community Support</h3>
              <p className="text-sage-600">Connect with like-minded individuals on similar wellness journeys.</p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Premium Section */}
      <section id="premium" className="py-20 bg-gradient-to-br from-amber-50 via-orange-50 to-red-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <Badge className="bg-gradient-to-r from-amber-500 to-orange-600 text-white px-6 py-3 text-lg font-semibold mb-6">
              <Crown className="w-5 h-5 mr-2" />
              Premium Membership
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold text-transparent bg-gradient-to-r from-amber-600 via-orange-600 to-red-600 bg-clip-text mb-6">
              Unlock Your Full<br />Wellness Potential
            </h2>
            <p className="text-xl text-sage-600 mb-8 max-w-3xl mx-auto">
              Join Pure Living Pro Premium and access exclusive content, personalized wellness plans, and advanced tools designed to accelerate your wellness transformation.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Free Plan */}
            <Card className="bg-white rounded-2xl premium-shadow">
              <CardHeader className="text-center">
                <div className="w-16 h-16 bg-sage-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Heart className="w-8 h-8 text-sage-600" />
                </div>
                <CardTitle className="text-2xl text-sage-700">Free</CardTitle>
                <div className="text-3xl font-bold text-sage-700 mb-2">£0</div>
                <CardDescription>Perfect for getting started</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-4 mb-8">
                  <li className="flex items-start space-x-3">
                    <div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center mt-0.5">
                      <Check className="w-3 h-3 text-green-600" />
                    </div>
                    <div>
                      <div className="font-medium text-sage-700">Basic Articles</div>
                      <div className="text-sm text-sage-600">Access to free wellness content</div>
                    </div>
                  </li>
                  <li className="flex items-start space-x-3">
                    <div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center mt-0.5">
                      <Check className="w-3 h-3 text-green-600" />
                    </div>
                    <div>
                      <div className="font-medium text-sage-700">Community Access</div>
                      <div className="text-sm text-sage-600">Join discussions and connect</div>
                    </div>
                  </li>
                </ul>
              </CardContent>
            </Card>

            {/* Pro Plan */}
            <Card className="bg-gradient-to-br from-amber-50 to-orange-50 border-2 border-amber-200 rounded-2xl premium-shadow relative">
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                <Badge className="bg-gradient-to-r from-amber-500 to-orange-500 text-white px-4 py-2">
                  <Sparkles className="w-4 h-4 mr-1" />
                  Most Popular
                </Badge>
              </div>
              <CardHeader className="text-center pt-8">
                <div className="w-16 h-16 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Crown className="w-8 h-8 text-white" />
                </div>
                <CardTitle className="text-2xl text-sage-700">Pro</CardTitle>
                <div className="text-3xl font-bold text-sage-700 mb-2">
                  £19.99<span className="text-lg font-normal text-sage-500">/month</span>
                </div>
                <CardDescription>Everything you need to thrive</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-4 mb-8">
                  <li className="flex items-start space-x-3">
                    <div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center mt-0.5">
                      <Check className="w-3 h-3 text-green-600" />
                    </div>
                    <div>
                      <div className="font-medium text-sage-700">Premium Articles</div>
                      <div className="text-sm text-sage-600">Access to in-depth, research-backed content</div>
                    </div>
                  </li>
                  <li className="flex items-start space-x-3">
                    <div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center mt-0.5">
                      <Check className="w-3 h-3 text-green-600" />
                    </div>
                    <div>
                      <div className="font-medium text-sage-700">AI Recommendations</div>
                      <div className="text-sm text-sage-600">Personalized content curation</div>
                    </div>
                  </li>
                  <li className="flex items-start space-x-3">
                    <div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center mt-0.5">
                      <Check className="w-3 h-3 text-green-600" />
                    </div>
                    <div>
                      <div className="font-medium text-sage-700">Ad-Free Experience</div>
                      <div className="text-sm text-sage-600">Clean, distraction-free reading</div>
                    </div>
                  </li>
                </ul>
                <Button 
                  className="w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white"
                  onClick={() => window.location.href = "/api/login"}
                >
                  <Crown className="w-4 h-4 mr-2" />
                  Upgrade to Pro
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-sage-800 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-sage-600 rounded-xl flex items-center justify-center">
                  <Leaf className="w-6 h-6 text-white" />
                </div>
                <span className="text-xl font-bold">Pure Living Pro</span>
              </div>
              <p className="text-sage-300 mb-4">
                Your trusted partner in holistic wellness and healthy living.
              </p>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold mb-4">Wellness</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-sage-300 hover:text-white transition-colors">Blog</a></li>
                <li><a href="#" className="text-sage-300 hover:text-white transition-colors">Wellness Picks</a></li>
                <li><a href="#" className="text-sage-300 hover:text-white transition-colors">Challenges</a></li>
                <li><a href="#" className="text-sage-300 hover:text-white transition-colors">Meditation</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold mb-4">Support</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-sage-300 hover:text-white transition-colors">Help Center</a></li>
                <li><a href="#" className="text-sage-300 hover:text-white transition-colors">Contact</a></li>
                <li><a href="#" className="text-sage-300 hover:text-white transition-colors">About</a></li>
                <li><a href="#" className="text-sage-300 hover:text-white transition-colors">Premium</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold mb-4">Newsletter</h4>
              <p className="text-sage-300 mb-4">Stay updated with our latest wellness tips and insights.</p>
              <div className="flex">
                <input 
                  type="email" 
                  placeholder="Your email" 
                  className="flex-1 px-4 py-2 bg-sage-700 border border-sage-600 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-sage-500"
                />
                <Button className="bg-sage-600 hover:bg-sage-500 px-4 py-2 rounded-r-lg">
                  <ArrowRight className="w-5 h-5" />
                </Button>
              </div>
            </div>
          </div>
          
          <div className="border-t border-sage-700 mt-12 pt-8 text-center text-sage-300">
            <p>&copy; 2024 Pure Living Pro. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
