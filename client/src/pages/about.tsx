import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Heart, Leaf, Users, Award, Sparkles, Target, Shield, Globe } from "lucide-react";
import { motion } from "framer-motion";

export default function About() {
  const values = [
    {
      icon: Heart,
      title: "Holistic Approach",
      description: "We believe in treating the whole person - mind, body, and spirit - rather than focusing on isolated symptoms or quick fixes.",
      color: "bg-red-50 border-red-200"
    },
    {
      icon: Leaf,
      title: "Natural Solutions",
      description: "We prioritize natural, evidence-based approaches that work in harmony with your body's innate healing capabilities.",
      color: "bg-green-50 border-green-200"
    },
    {
      icon: Users,
      title: "Community Focus",
      description: "We foster a supportive community where members can share experiences, learn from each other, and grow together.",
      color: "bg-blue-50 border-blue-200"
    },
    {
      icon: Award,
      title: "Evidence-Based",
      description: "All our recommendations are backed by scientific research and validated by wellness experts and healthcare professionals.",
      color: "bg-amber-50 border-amber-200"
    }
  ];

  const team = [
    {
      name: "Dr. Sarah Chen",
      role: "Founder & Wellness Director",
      expertise: "Integrative Medicine, Nutrition",
      image: "👩‍⚕️",
      bio: "With over 15 years in integrative medicine, Dr. Chen combines traditional healing with modern science."
    },
    {
      name: "Marcus Rodriguez",
      role: "Head of Content",
      expertise: "Wellness Writing, Research",
      image: "📝",
      bio: "Marcus has authored over 200 wellness articles and specializes in translating complex health concepts."
    },
    {
      name: "Elena Patel",
      role: "Product Curator",
      expertise: "Natural Products, Quality Assurance",
      image: "🔍",
      bio: "Elena ensures every product meets our strict standards for quality, safety, and effectiveness."
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-sage-25 to-white">
      {/* Hero Section */}
      <section className="pt-24 pb-16 bg-gradient-to-br from-sage-50 to-green-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center max-w-4xl mx-auto"
          >
            <Badge className="bg-sage-100 text-sage-700 mb-6">
              <Sparkles className="w-4 h-4 mr-2" />
              About Pure Living Pro
            </Badge>
            <h1 className="text-4xl md:text-6xl font-bold text-sage-800 mb-6 leading-tight">
              Empowering Your{" "}
              <span className="text-transparent bg-gradient-to-r from-sage-600 to-green-500 bg-clip-text">
                Wellness Journey
              </span>
            </h1>
            <p className="text-xl text-sage-600 mb-8 max-w-3xl mx-auto">
              Pure Living Pro was founded on the belief that everyone deserves access to authentic, 
              science-backed wellness guidance. We're here to bridge the gap between ancient wisdom 
              and modern research, making holistic health accessible to all.
            </p>
            <div className="relative max-w-2xl mx-auto">
              <img 
                src="https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400" 
                alt="Wellness community gathering in nature" 
                className="rounded-2xl shadow-xl w-full"
              />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="text-3xl md:text-4xl font-bold text-sage-800 mb-6">
                Empowering Your Wellness Journey
              </h2>
              <p className="text-lg text-sage-600 mb-6">
                In a world overwhelmed with conflicting health information, we provide clarity, 
                authenticity, and practical guidance. Our mission is to help you discover what 
                truly works for your unique body, lifestyle, and goals.
              </p>
              <p className="text-lg text-sage-600 mb-8">
                We believe that wellness isn't one-size-fits-all. That's why we combine AI-powered 
                personalization with expert curation to deliver content and recommendations tailored 
                specifically to you.
              </p>
              <div className="flex flex-wrap gap-4">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span className="text-sage-700 font-medium">Evidence-Based Content</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                  <span className="text-sage-700 font-medium">Expert Curation</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-amber-500 rounded-full"></div>
                  <span className="text-sage-700 font-medium">Personalized Approach</span>
                </div>
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative"
            >
              <img 
                src="https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=600" 
                alt="Person practicing mindfulness in a serene environment" 
                className="rounded-2xl shadow-xl w-full"
              />
              <div className="absolute -bottom-6 -left-6 bg-white rounded-2xl p-6 shadow-lg">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-sage-100 rounded-full flex items-center justify-center">
                    <Target className="w-6 h-6 text-sage-600" />
                  </div>
                  <div>
                    <div className="font-bold text-sage-800">50,000+</div>
                    <div className="text-sm text-sage-600">Lives Transformed</div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 bg-sage-25">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-sage-800 mb-4">
              Our Core Values
            </h2>
            <p className="text-lg text-sage-600 max-w-3xl mx-auto">
              These values guide every decision we make, from the content we publish to the products we recommend.
            </p>
          </motion.div>
          
          <div className="grid md:grid-cols-2 gap-8">
            {values.map((value, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <Card className={`h-full border-2 ${value.color} hover:shadow-lg transition-all duration-300`}>
                  <CardHeader>
                    <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center mb-4 shadow-sm">
                      <value.icon className="w-6 h-6 text-sage-600" />
                    </div>
                    <CardTitle className="text-xl text-sage-800">{value.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-sage-600 text-base leading-relaxed">
                      {value.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-sage-800 mb-4">
              Meet Our Wellness Experts
            </h2>
            <p className="text-lg text-sage-600 max-w-3xl mx-auto">
              Our team combines decades of experience in wellness, medicine, and content creation 
              to bring you the most reliable and practical guidance.
            </p>
          </motion.div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {team.map((member, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <Card className="h-full hover:shadow-lg transition-shadow duration-300">
                  <CardHeader className="text-center">
                    <div className="text-6xl mb-4">{member.image}</div>
                    <CardTitle className="text-xl text-sage-800">{member.name}</CardTitle>
                    <Badge variant="secondary" className="w-fit mx-auto">{member.role}</Badge>
                    <div className="text-sm text-sage-600 mt-2">{member.expertise}</div>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-sage-600 text-center">
                      {member.bio}
                    </CardDescription>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-gradient-to-br from-sage-600 to-green-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="text-4xl font-bold mb-2">50K+</div>
              <div className="text-sage-100">Community Members</div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <div className="text-4xl font-bold mb-2">500+</div>
              <div className="text-sage-100">Expert Articles</div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <div className="text-4xl font-bold mb-2">1000+</div>
              <div className="text-sage-100">Curated Products</div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <div className="text-4xl font-bold mb-2">98%</div>
              <div className="text-sage-100">Satisfaction Rate</div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-sage-800 mb-4">
              Ready to Begin Your Wellness Journey?
            </h2>
            <p className="text-lg text-sage-600 mb-8">
              Join our community of wellness enthusiasts and start transforming your life today.
            </p>
            <Button 
              size="lg"
              onClick={() => window.location.href = "/api/login"}
              className="bg-sage-600 hover:bg-sage-700 text-white px-8 py-4 text-lg font-semibold"
            >
              <Users className="w-5 h-5 mr-2" />
              Join Our Community
            </Button>
          </motion.div>
        </div>
      </section>
    </div>
  );
}