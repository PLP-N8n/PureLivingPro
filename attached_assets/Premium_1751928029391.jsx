import React, { useState, useEffect } from "react";
import { User } from "@/api/entities";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Crown, 
  Check, 
  Star, 
  BookOpen, 
  Zap, 
  Shield, 
  Heart,
  Sparkles,
  TrendingUp,
  Users,
  Clock
} from "lucide-react";
import { motion } from "framer-motion";
import OptimizedImage from "@/components/shared/OptimizedImage";

const features = [
  {
    icon: BookOpen,
    title: "Premium Articles",
    description: "Access to in-depth, research-backed premium content",
    free: false,
    pro: true
  },
  {
    icon: Zap,
    title: "Ad-Free Experience",
    description: "Clean, distraction-free reading experience",
    free: false,
    pro: true
  },
  {
    icon: Heart,
    title: "Personalized Recommendations",
    description: "AI-curated content based on your wellness profile",
    free: true,
    pro: true
  },
  {
    icon: Users,
    title: "Community Access",
    description: "Join discussions and connect with like-minded individuals",
    free: true,
    pro: true
  },
  {
    icon: Star,
    title: "Early Access",
    description: "First access to new features and content",
    free: false,
    pro: true
  },
  {
    icon: Shield,
    title: "Expert Support",
    description: "Direct access to wellness experts for questions",
    free: false,
    pro: true
  }
];

const testimonials = [
  {
    name: "Sarah M.",
    role: "Wellness Enthusiast",
    content: "The premium content has transformed my approach to holistic health. The research-backed insights are invaluable.",
    rating: 5
  },
  {
    name: "David K.",
    role: "Nutritionist",
    content: "As a professional, I appreciate the depth and quality of the premium articles. They're incredibly well-researched.",
    rating: 5
  },
  {
    name: "Emma L.",
    role: "Busy Professional",
    content: "The personalized recommendations save me so much time. I only see content that's relevant to my wellness goals.",
    rating: 5
  }
];

export default function Premium() {
  const [currentUser, setCurrentUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadCurrentUser();
  }, []);

  const loadCurrentUser = async () => {
    try {
      const user = await User.me();
      setCurrentUser(user);
    } catch (error) {
      setCurrentUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  const isProMember = currentUser?.membership_level === 'pro';

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-red-50">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <div className="mb-8">
                <OptimizedImage
                  src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/7922d7bf4_LogoFinal.jpg"
                  alt="Pure Living Pro Premium - Unlock Your Wellness Potential"
                  className="h-16 w-auto mx-auto"
                  width={160}
                  height={64}
                  crop="fit"
                  gravity="center"
                  loading="eager"
                  quality="auto:best"
                  sizes="160px"
                  enableModernFormats={true}
                />
              </div>
            
              <Badge className="bg-gradient-to-r from-amber-500 to-orange-600 text-white px-6 py-3 rounded-full text-lg font-semibold mb-6">
                <Crown className="w-5 h-5 mr-2" />
                Premium Membership
              </Badge>
              
              <h1 className="text-5xl md:text-7xl font-bold text-transparent bg-gradient-to-r from-amber-600 via-orange-600 to-red-600 bg-clip-text mb-6">
                Unlock Your Full
                <br />
                Wellness Potential
              </h1>
              
              <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
                Join Pure Living Pro Premium and access exclusive content, personalized wellness plans, 
                and advanced tools designed to accelerate your wellness transformation.
              </p>

              {isProMember ? (
                <Card className="bg-gradient-to-r from-green-50 to-emerald-50 border-green-200 p-8 organic-border">
                  <div className="flex items-center justify-center mb-4">
                    <Crown className="w-8 h-8 text-amber-500 mr-3" />
                    <span className="text-2xl font-bold text-sage-700">You're a Pro Member!</span>
                  </div>
                  <p className="text-sage-600 mb-4">
                    Thank you for being part of our wellness community. Enjoy all the premium benefits!
                  </p>
                  <Button className="bg-sage-600 hover:bg-sage-700 text-white">
                    Access Premium Content
                  </Button>
                </Card>
              ) : (
                <div className="space-y-6">
                  <div className="flex items-center justify-center space-x-8 mb-8">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-sage-700">500+</div>
                      <div className="text-sage-600">Premium Articles</div>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-sage-700">5K+</div>
                      <div className="text-sage-600">Pro Members</div>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-sage-700">4.9★</div>
                      <div className="text-sage-600">Member Rating</div>
                    </div>
                  </div>

                  <Card className="bg-gradient-to-r from-amber-50 to-orange-50 border-amber-200 p-8 organic-border premium-shadow">
                    <div className="text-center">
                      <div className="text-4xl font-bold text-sage-700 mb-2">
                        £19.99<span className="text-lg font-normal text-sage-500">/month</span>
                      </div>
                      <p className="text-sage-600 mb-6">Full access to all premium features</p>
                      <Button size="lg" className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white px-12 py-4 text-lg organic-border premium-shadow">
                        <Crown className="w-5 h-5 mr-2" />
                        Upgrade to Pro
                      </Button>
                      <p className="text-sm text-sage-500 mt-4">
                        30-day money-back guarantee • Cancel anytime
                      </p>
                    </div>
                  </Card>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Feature Comparison */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white/50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-sage-700 mb-4">
              Compare Plans
            </h2>
            <p className="text-lg text-sage-600">
              See what's included with each membership level
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Free Plan */}
            <Card className="organic-border premium-shadow bg-white">
              <CardHeader className="text-center pb-8">
                <div className="w-16 h-16 bg-sage-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Heart className="w-8 h-8 text-sage-600" />
                </div>
                <CardTitle className="text-2xl font-bold text-sage-700">Free</CardTitle>
                <div className="text-3xl font-bold text-sage-700 mt-2">£0</div>
                <p className="text-sage-600">Perfect for getting started</p>
              </CardHeader>
              <CardContent>
                <ul className="space-y-4">
                  {features.map((feature, index) => (
                    <li key={index} className={`flex items-start space-x-3 ${!feature.free ? 'opacity-50' : ''}`}>
                      <div className={`w-5 h-5 rounded-full flex items-center justify-center mt-0.5 ${
                        feature.free ? 'bg-green-100' : 'bg-gray-200'
                      }`}>
                        {feature.free ? (
                          <Check className="w-3 h-3 text-green-600" />
                        ) : (
                          <div className="w-2 h-2 bg-gray-400 rounded-full" />
                        )}
                      </div>
                      <div>
                        <div className="font-medium text-sage-700">{feature.title}</div>
                        <div className="text-sm text-sage-600">{feature.description}</div>
                      </div>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            {/* Pro Plan */}
            <Card className="organic-border premium-shadow bg-gradient-to-br from-amber-50 to-orange-50 border-amber-200 relative">
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                <Badge className="bg-gradient-to-r from-amber-500 to-orange-500 text-white px-4 py-2">
                  <Sparkles className="w-4 h-4 mr-1" />
                  Most Popular
                </Badge>
              </div>
              <CardHeader className="text-center pb-8 pt-8">
                <div className="w-16 h-16 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Crown className="w-8 h-8 text-white" />
                </div>
                <CardTitle className="text-2xl font-bold text-sage-700">Pro</CardTitle>
                <div className="text-3xl font-bold text-sage-700 mt-2">
                  £19.99<span className="text-lg font-normal text-sage-500">/month</span>
                </div>
                <p className="text-sage-600">Everything you need to thrive</p>
              </CardHeader>
              <CardContent>
                <ul className="space-y-4">
                  {features.map((feature, index) => (
                    <li key={index} className="flex items-start space-x-3">
                      <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center mt-0.5">
                        <Check className="w-3 h-3 text-green-600" />
                      </div>
                      <div>
                        <div className="font-medium text-sage-700">{feature.title}</div>
                        <div className="text-sm text-sage-600">{feature.description}</div>
                      </div>
                    </li>
                  ))}
                </ul>
                {!isProMember && (
                  <Button className="w-full mt-8 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white organic-border">
                    <Crown className="w-4 h-4 mr-2" />
                    Upgrade to Pro
                  </Button>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-sage-700 mb-4">
              What Our Pro Members Say
            </h2>
            <p className="text-lg text-sage-600">
              Join thousands who've transformed their wellness journey
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card className="organic-border premium-shadow bg-white h-full">
                  <CardContent className="p-6">
                    <div className="flex items-center mb-4">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                      ))}
                    </div>
                    <p className="text-sage-600 mb-4 italic">"{testimonial.content}"</p>
                    <div>
                      <div className="font-semibold text-sage-700">{testimonial.name}</div>
                      <div className="text-sm text-sage-500">{testimonial.role}</div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white/50">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-sage-700 mb-4">
              Frequently Asked Questions
            </h2>
          </div>

          <div className="space-y-6">
            <Card className="organic-border premium-shadow bg-white">
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold text-sage-700 mb-2">
                  What's included in the Pro membership?
                </h3>
                <p className="text-sage-600">
                  Pro membership includes access to all premium articles, an ad-free experience, 
                  personalized content recommendations, early access to new features, and direct 
                  access to our wellness experts.
                </p>
              </CardContent>
            </Card>

            <Card className="organic-border premium-shadow bg-white">
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold text-sage-700 mb-2">
                  Can I cancel my membership anytime?
                </h3>
                <p className="text-sage-600">
                  Yes, you can cancel your Pro membership at any time. You'll continue to have 
                  access to Pro features until the end of your current billing period.
                </p>
              </CardContent>
            </Card>

            <Card className="organic-border premium-shadow bg-white">
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold text-sage-700 mb-2">
                  Is there a money-back guarantee?
                </h3>
                <p className="text-sage-600">
                  We offer a 30-day money-back guarantee. If you're not completely satisfied 
                  with your Pro membership, we'll refund your payment within the first 30 days.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      {!isProMember && (
        <section className="py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <Card className="bg-gradient-to-r from-sage-50 to-amber-50 border-sage-200 p-12 organic-border premium-shadow">
              <div className="w-20 h-20 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <Crown className="w-10 h-10 text-white" />
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-sage-700 mb-4">
                Ready to Transform Your Wellness Journey?
              </h2>
              <p className="text-lg text-sage-600 mb-8">
                Join Pro today and unlock the full potential of your holistic health practices.
              </p>
              <Button size="lg" className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white px-12 py-4 text-lg organic-border premium-shadow">
                <Crown className="w-5 h-5 mr-2" />
                Start Your Pro Journey
              </Button>
              <p className="text-sm text-sage-500 mt-4">
                30-day money-back guarantee • No long-term commitment
              </p>
            </Card>
          </div>
        </section>
      )}
    </div>
  );
}