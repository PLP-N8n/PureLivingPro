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

// Import wellness category images
import fitnessImg from "@assets/Fitness_1751936986685.jpeg";
import fitness2Img from "@assets/fitness2_1751936986686.jpeg";
import healthyRecipesImg from "@assets/Healthy Recipies_1751936986687.jpeg";
import homepageImg from "@assets/Homepage_1751936986687.jpeg";
import logoFinal from "@assets/Logo Final _1751936986687.jpeg";
import heroImage from "@assets/Homepage_1751937698807.jpeg";
import mindfulnessImg from "@assets/Mindfulness & Meditation_1751936986688.jpeg";
import naturalRemediesImg from "@assets/Natural Remidies_1751936986688.jpeg";
import nutritionImg from "@assets/Nutrition_1751936986688.jpeg";
import premiumSupplementsImg from "@assets/Premium Suppliments_1751936986689.jpeg";
import skinCareImg from "@assets/Skin Care_1751936986689.jpeg";

export default function Landing() {
  return (
    <div className="min-h-screen bg-sage-25">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-sm border-b border-sage-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <img 
                src={logoFinal} 
                alt="Pure Living Pro Logo" 
                className="w-10 h-10 rounded-xl object-cover"
              />
              <span className="text-xl font-bold text-tulsi-700">Pure Living Pro</span>
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
      <section id="home" className="pt-24 pb-16 tulsi-gradient hero-pattern">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center lg:text-left"
            >
              <Badge className="bg-tulsi-100 text-tulsi-700 border-tulsi-200 mb-6">
                <Sparkles className="w-3 h-3 mr-1" />
                60-Day Free Trial • No Credit Card Required
              </Badge>
              
              <h1 className="text-4xl md:text-6xl font-bold text-tulsi-800 mb-6 leading-tight">
                Your AI-Powered
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-tulsi-600 to-tulsi-500 block">
                  Wellness Journey
                </span>
              </h1>
              
              <p className="text-xl text-tulsi-600 mb-8 leading-relaxed font-light">
                Transform your wellness routine with personalized AI coaching, curated content, 
                and a supportive community. Start with our rich free content, then unlock your 
                full potential with premium features.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Button 
                  size="lg" 
                  className="bg-tulsi-600 hover:bg-tulsi-700 text-white px-8 py-4 text-lg"
                  onClick={() => window.location.href = "/api/login"}
                >
                  <Crown className="w-5 h-5 mr-2" />
                  Start Free Trial
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
                
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="border-tulsi-300 text-tulsi-700 hover:bg-tulsi-50 px-8 py-4 text-lg"
                  onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })}
                >
                  <Play className="w-5 h-5 mr-2" />
                  Explore Features
                </Button>
              </div>
              
              <div className="mt-8 flex items-center justify-center lg:justify-start space-x-6 text-sm text-tulsi-600">
                <div className="flex items-center">
                  <Check className="w-4 h-4 text-green-600 mr-2" />
                  Free wellness content
                </div>
                <div className="flex items-center">
                  <Check className="w-4 h-4 text-green-600 mr-2" />
                  AI meal planning
                </div>
                <div className="flex items-center">
                  <Check className="w-4 h-4 text-green-600 mr-2" />
                  Personalized coaching
                </div>
              </div>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="relative"
            >
              <div className="bg-white rounded-2xl shadow-2xl overflow-hidden border border-tulsi-100">
                <div className="relative">
                  <img 
                    src={heroImage} 
                    alt="Pure Living Pro - Your Wellness Journey Begins" 
                    className="w-full h-64 object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-tulsi-900/60 to-transparent"></div>
                  <div className="absolute bottom-6 left-6 text-white">
                    <div className="w-14 h-14 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center mb-3">
                      <Brain className="w-7 h-7 text-white" />
                    </div>
                    <h3 className="text-xl font-bold mb-1">AI Wellness Coach</h3>
                    <p className="text-white/90 text-sm">Personalized guidance for your unique journey</p>
                  </div>
                </div>
                <div className="p-8">
                  <div className="space-y-4">
                  <div className="bg-sage-50 rounded-lg p-4">
                    <div className="flex items-center mb-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                      <span className="text-sage-700 font-medium">Daily Wellness Plan Generated</span>
                    </div>
                    <p className="text-sm text-sage-600 ml-5">
                      "Based on your sleep patterns and stress levels, here's your personalized plan..."
                    </p>
                  </div>
                  
                  <div className="bg-blue-50 rounded-lg p-4">
                    <div className="flex items-center mb-2">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                      <span className="text-sage-700 font-medium">Meal Plan Updated</span>
                    </div>
                    <p className="text-sm text-sage-600 ml-5">
                      "3 anti-inflammatory recipes added to support your energy goals"
                    </p>
                  </div>
                  
                  <div className="bg-purple-50 rounded-lg p-4">
                    <div className="flex items-center mb-2">
                      <div className="w-2 h-2 bg-purple-500 rounded-full mr-3"></div>
                      <span className="text-sage-700 font-medium">Progress Milestone</span>
                    </div>
                    <p className="text-sm text-sage-600 ml-5">
                      "You've completed 7 days of mindful morning routine!"
                    </p>
                  </div>
                  </div>
                </div>
              </div>
              
              {/* Floating elements */}
              <div className="absolute -top-4 -right-4 w-20 h-20 bg-gradient-to-br from-tulsi-400 to-tulsi-500 rounded-full opacity-20"></div>
              <div className="absolute -bottom-6 -left-6 w-16 h-16 bg-gradient-to-br from-tulsi-300 to-tulsi-400 rounded-full opacity-20"></div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Free vs Premium Features */}
      <section id="features" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-sage-800 mb-4">
              Free Content Hub + Premium AI Companion
            </h2>
            <p className="text-xl text-sage-600 max-w-3xl mx-auto">
              Start with our comprehensive free wellness library, then unlock personalized AI coaching 
              and advanced tools with your 60-day free trial.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Free Tier */}
            <Card className="border-2 border-sage-200 relative">
              <CardHeader className="text-center pb-8">
                <Badge className="bg-sage-100 text-sage-700 border-sage-200 mb-4 mx-auto w-fit">
                  Free Forever
                </Badge>
                <CardTitle className="text-2xl text-sage-800">Wellness Content Hub</CardTitle>
                <CardDescription className="text-lg">
                  Rich wellness content accessible to everyone
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center">
                  <Check className="w-5 h-5 text-green-600 mr-3" />
                  <span>Comprehensive wellness blog & insights</span>
                </div>
                <div className="flex items-center">
                  <Check className="w-5 h-5 text-green-600 mr-3" />
                  <span>Curated product recommendations</span>
                </div>
                <div className="flex items-center">
                  <Check className="w-5 h-5 text-green-600 mr-3" />
                  <span>Natural remedies & healthy recipes</span>
                </div>
                <div className="flex items-center">
                  <Check className="w-5 h-5 text-green-600 mr-3" />
                  <span>Basic community features</span>
                </div>
                <div className="flex items-center">
                  <Check className="w-5 h-5 text-green-600 mr-3" />
                  <span>Wellness tips & guidance</span>
                </div>
                
                <Button 
                  variant="outline" 
                  className="w-full mt-6 border-sage-300 text-sage-700 hover:bg-sage-50"
                  onClick={() => document.getElementById('blog')?.scrollIntoView({ behavior: 'smooth' })}
                >
                  <Leaf className="w-4 h-4 mr-2" />
                  Explore Free Content
                </Button>
              </CardContent>
            </Card>

            {/* Premium Tier */}
            <Card className="border-2 border-emerald-300 relative bg-gradient-to-b from-emerald-50 to-white">
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <Badge className="bg-emerald-500 text-white border-emerald-400">
                  <Crown className="w-3 h-3 mr-1" />
                  Most Popular
                </Badge>
              </div>
              
              <CardHeader className="text-center pb-8 pt-8">
                <Badge className="bg-emerald-100 text-emerald-700 border-emerald-200 mb-4 mx-auto w-fit">
                  60-Day Free Trial
                </Badge>
                <CardTitle className="text-2xl text-sage-800">AI Wellness Companion</CardTitle>
                <CardDescription className="text-lg">
                  Personalized AI coaching & advanced tools
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center">
                  <Check className="w-5 h-5 text-emerald-600 mr-3" />
                  <span className="font-medium">AI-powered personalized meal plans</span>
                </div>
                <div className="flex items-center">
                  <Check className="w-5 h-5 text-emerald-600 mr-3" />
                  <span className="font-medium">Custom wellness plans & coaching</span>
                </div>
                <div className="flex items-center">
                  <Check className="w-5 h-5 text-emerald-600 mr-3" />
                  <span className="font-medium">Premium guided meditation library</span>
                </div>
                <div className="flex items-center">
                  <Check className="w-5 h-5 text-emerald-600 mr-3" />
                  <span className="font-medium">Exclusive wellness challenges</span>
                </div>
                <div className="flex items-center">
                  <Check className="w-5 h-5 text-emerald-600 mr-3" />
                  <span className="font-medium">Advanced progress analytics</span>
                </div>
                <div className="flex items-center">
                  <Check className="w-5 h-5 text-emerald-600 mr-3" />
                  <span className="font-medium">Enhanced personalized dashboard</span>
                </div>
                <div className="flex items-center">
                  <Check className="w-5 h-5 text-emerald-600 mr-3" />
                  <span className="font-medium">Priority support</span>
                </div>
                
                <Button 
                  className="w-full mt-6 bg-emerald-600 hover:bg-emerald-700 text-white"
                  onClick={() => window.location.href = "/api/login"}
                >
                  <Crown className="w-4 h-4 mr-2" />
                  Start Free Trial
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
                
                <p className="text-sm text-sage-600 text-center mt-2">
                  No credit card required • Cancel anytime
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Sample Blog Content */}
      <section id="blog" className="py-20 bg-sage-25">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-sage-800 mb-4">
              Latest Wellness Insights
            </h2>
            <p className="text-xl text-sage-600">
              Free, evidence-based content to support your wellness journey
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Sample blog posts */}
            {[
              {
                title: "5 Morning Rituals for Natural Energy",
                category: "Wellness",
                excerpt: "Transform your mornings with these science-backed practices that boost energy naturally...",
                readTime: "4 min read"
              },
              {
                title: "Mindful Eating: Transform Your Relationship with Food",
                category: "Nutrition", 
                excerpt: "Discover how mindful eating can improve digestion, reduce stress, and enhance satisfaction...",
                readTime: "6 min read"
              },
              {
                title: "The Science of Sleep: Natural Ways to Improve Rest",
                category: "Health",
                excerpt: "Learn evidence-based strategies to optimize your sleep quality without relying on medications...",
                readTime: "5 min read"
              }
            ].map((post, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <Card className="h-full hover:shadow-lg transition-shadow duration-300 border-sage-200">
                  <CardHeader>
                    <Badge className="bg-sage-100 text-sage-700 border-sage-200 mb-3 w-fit">
                      {post.category}
                    </Badge>
                    <CardTitle className="text-xl text-sage-800 line-clamp-2">
                      {post.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sage-600 mb-4 line-clamp-3">{post.excerpt}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-sage-500">{post.readTime}</span>
                      <Button variant="ghost" size="sm" className="text-sage-600 hover:text-sage-800">
                        Read More <ArrowRight className="w-3 h-3 ml-1" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Button 
              variant="outline" 
              size="lg"
              className="border-sage-300 text-sage-700 hover:bg-sage-50"
            >
              View All Articles
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </div>
      </section>

      {/* Sample Wellness Picks */}
      <section id="products" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-sage-800 mb-4">
              Wellness Picks
            </h2>
            <p className="text-xl text-sage-600">
              Carefully curated products to support your natural wellness routine
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                name: "Organic Ashwagandha Capsules",
                category: "Supplements",
                price: "$29.99",
                rating: 4.8,
                description: "Premium stress-relief supplement for natural calm and energy"
              },
              {
                name: "Bamboo Meditation Cushion",
                category: "Meditation",
                price: "$45.00", 
                rating: 4.9,
                description: "Eco-friendly meditation cushion for comfortable practice"
              },
              {
                name: "Essential Oil Diffuser Set",
                category: "Aromatherapy",
                price: "$79.99",
                rating: 4.7,
                description: "Complete aromatherapy set with 6 organic essential oils"
              }
            ].map((product, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <Card className="h-full hover:shadow-lg transition-shadow duration-300 border-sage-200">
                  <CardHeader>
                    <div className="flex items-center justify-between mb-2">
                      <Badge className="bg-blue-100 text-blue-700 border-blue-200">
                        {product.category}
                      </Badge>
                      <div className="flex items-center">
                        <Star className="w-4 h-4 text-yellow-500 fill-current" />
                        <span className="text-sm text-sage-600 ml-1">{product.rating}</span>
                      </div>
                    </div>
                    <CardTitle className="text-xl text-sage-800">
                      {product.name}
                    </CardTitle>
                    <div className="text-2xl font-bold text-emerald-600">{product.price}</div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sage-600 mb-4">{product.description}</p>
                    <Button className="w-full bg-sage-600 hover:bg-sage-700 text-white">
                      <ShoppingBag className="w-4 h-4 mr-2" />
                      View Product
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 wellness-gradient">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-sage-800 mb-6">
              Ready to Transform Your Wellness Journey?
            </h2>
            <p className="text-xl text-sage-600 mb-8 leading-relaxed">
              Join thousands who have discovered their path to natural wellness with our AI-powered platform. 
              Start with free content, unlock premium features with your 60-day trial.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
              <Button 
                size="lg"
                className="bg-sage-600 hover:bg-sage-700 text-white px-8 py-4 text-lg"
                onClick={() => window.location.href = "/api/login"}
              >
                <Crown className="w-5 h-5 mr-2" />
                Start Your Free Trial
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
              
              <Button 
                size="lg"
                variant="outline"
                className="border-sage-300 text-sage-700 hover:bg-sage-50 px-8 py-4 text-lg"
                onClick={() => document.getElementById('blog')?.scrollIntoView({ behavior: 'smooth' })}
              >
                <Leaf className="w-5 h-5 mr-2" />
                Explore Free Content
              </Button>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 text-center">
              <div>
                <div className="text-3xl font-bold text-sage-800 mb-2">60 Days</div>
                <div className="text-sage-600">Free Trial</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-sage-800 mb-2">No Card</div>
                <div className="text-sage-600">Required</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-sage-800 mb-2">Cancel</div>
                <div className="text-sage-600">Anytime</div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-sage-800 text-sage-100 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-3 mb-4">
                <img 
                  src={logoFinal} 
                  alt="Pure Living Pro Logo" 
                  className="w-8 h-8 rounded-lg object-cover"
                />
                <span className="text-lg font-bold">Pure Living Pro</span>
              </div>
              <p className="text-sage-300 text-sm">
                Your AI-powered wellness companion for a naturally healthy lifestyle.
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Free Resources</h4>
              <ul className="space-y-2 text-sm text-sage-300">
                <li><a href="#" className="hover:text-sage-100 transition-colors">Wellness Blog</a></li>
                <li><a href="#" className="hover:text-sage-100 transition-colors">Healthy Recipes</a></li>
                <li><a href="#" className="hover:text-sage-100 transition-colors">Natural Remedies</a></li>
                <li><a href="#" className="hover:text-sage-100 transition-colors">Wellness Picks</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Premium Features</h4>
              <ul className="space-y-2 text-sm text-sage-300">
                <li><a href="#" className="hover:text-sage-100 transition-colors">AI Meal Planner</a></li>
                <li><a href="#" className="hover:text-sage-100 transition-colors">Personalized Coaching</a></li>
                <li><a href="#" className="hover:text-sage-100 transition-colors">Guided Meditation</a></li>
                <li><a href="#" className="hover:text-sage-100 transition-colors">Wellness Challenges</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-sm text-sage-300">
                <li><a href="#" className="hover:text-sage-100 transition-colors">Help Center</a></li>
                <li><a href="#" className="hover:text-sage-100 transition-colors">Contact Us</a></li>
                <li><a href="#" className="hover:text-sage-100 transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-sage-100 transition-colors">Terms of Service</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-sage-700 mt-8 pt-8 text-center text-sm text-sage-300">
            <p>&copy; 2025 Pure Living Pro. All rights reserved. Your journey to natural wellness starts here.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}