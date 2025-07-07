import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Mail, Phone, MapPin, Clock, Send, MessageCircle, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import { useToast } from "@/hooks/use-toast";

export default function Contact() {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Simulate form submission
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: "Message sent successfully!",
        description: "We'll get back to you within 24 hours.",
      });
      
      // Reset form
      setFormData({
        name: "",
        email: "",
        subject: "",
        message: ""
      });
    } catch (error) {
      toast({
        title: "Error sending message",
        description: "Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const contactInfo = [
    {
      icon: Mail,
      title: "Email Us",
      value: "hello@purelivingpro.com",
      description: "For general inquiries and support"
    },
    {
      icon: Phone,
      title: "Call Us",
      value: "+1 (555) 123-4567",
      description: "Monday to Friday, 9AM - 6PM EST"
    },
    {
      icon: MapPin,
      title: "Visit Us",
      value: "123 Wellness Street, Health City, HC 12345",
      description: "Our wellness center and headquarters"
    },
    {
      icon: Clock,
      title: "Business Hours",
      value: "Mon-Fri: 9AM-6PM EST",
      description: "Weekend support via email only"
    }
  ];

  const faqItems = [
    {
      question: "How do I access premium content?",
      answer: "Sign up for a Pure Living Pro account and upgrade to our Premium subscription to access exclusive articles, personalized wellness plans, and advanced features."
    },
    {
      question: "Are your product recommendations affiliate links?",
      answer: "Yes, some product recommendations include affiliate links. We only recommend products we've thoroughly researched and believe in. All affiliations are clearly disclosed."
    },
    {
      question: "Can I cancel my subscription anytime?",
      answer: "Absolutely! You can cancel your Premium subscription at any time from your account settings. You'll continue to have access until the end of your billing period."
    },
    {
      question: "Do you offer personalized wellness consultations?",
      answer: "Premium members have access to AI-powered personalized recommendations. For one-on-one consultations with our wellness experts, please contact us directly."
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
              <MessageCircle className="w-4 h-4 mr-2" />
              Get In Touch
            </Badge>
            <h1 className="text-4xl md:text-6xl font-bold text-sage-800 mb-6 leading-tight">
              We'd Love to{" "}
              <span className="text-transparent bg-gradient-to-r from-sage-600 to-green-500 bg-clip-text">
                Hear From You
              </span>
            </h1>
            <p className="text-xl text-sage-600 mb-8 max-w-3xl mx-auto">
              Whether you have questions about wellness, need support with your account, 
              or want to share your wellness journey with us, we're here to help. 
              Our team typically responds within 24 hours.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Contact Form & Info Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16">
            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <Card className="shadow-lg border-sage-200">
                <CardHeader>
                  <CardTitle className="text-2xl text-sage-800 flex items-center gap-2">
                    <Send className="w-6 h-6" />
                    Send us a Message
                  </CardTitle>
                  <CardDescription>
                    Fill out the form below and we'll get back to you as soon as possible.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="name" className="block text-sm font-medium text-sage-700 mb-2">
                          Full Name *
                        </label>
                        <Input
                          id="name"
                          name="name"
                          type="text"
                          required
                          value={formData.name}
                          onChange={handleInputChange}
                          placeholder="Your full name"
                          className="border-sage-200 focus:border-sage-400"
                        />
                      </div>
                      <div>
                        <label htmlFor="email" className="block text-sm font-medium text-sage-700 mb-2">
                          Email Address *
                        </label>
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          required
                          value={formData.email}
                          onChange={handleInputChange}
                          placeholder="your.email@example.com"
                          className="border-sage-200 focus:border-sage-400"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label htmlFor="subject" className="block text-sm font-medium text-sage-700 mb-2">
                        Subject *
                      </label>
                      <Input
                        id="subject"
                        name="subject"
                        type="text"
                        required
                        value={formData.subject}
                        onChange={handleInputChange}
                        placeholder="What's this about?"
                        className="border-sage-200 focus:border-sage-400"
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="message" className="block text-sm font-medium text-sage-700 mb-2">
                        Message *
                      </label>
                      <Textarea
                        id="message"
                        name="message"
                        required
                        value={formData.message}
                        onChange={handleInputChange}
                        placeholder="Tell us more about your question or feedback..."
                        className="border-sage-200 focus:border-sage-400 min-h-32"
                      />
                    </div>
                    
                    <Button 
                      type="submit" 
                      disabled={isSubmitting}
                      className="w-full bg-sage-600 hover:bg-sage-700 text-white py-3"
                    >
                      {isSubmitting ? (
                        <div className="flex items-center gap-2">
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          Sending...
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          <Send className="w-4 h-4" />
                          Send Message
                        </div>
                      )}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </motion.div>

            {/* Contact Information */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="space-y-8"
            >
              <div>
                <h2 className="text-2xl font-bold text-sage-800 mb-6">Get in Touch</h2>
                <p className="text-sage-600 mb-8">
                  Choose the method that works best for you. We're committed to providing 
                  excellent support for all our community members.
                </p>
              </div>

              <div className="grid gap-6">
                {contactInfo.map((info, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                  >
                    <Card className="hover:shadow-md transition-shadow duration-300">
                      <CardContent className="p-6">
                        <div className="flex items-start gap-4">
                          <div className="w-12 h-12 bg-sage-100 rounded-xl flex items-center justify-center flex-shrink-0">
                            <info.icon className="w-6 h-6 text-sage-600" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-sage-800 mb-1">{info.title}</h3>
                            <p className="text-sage-700 font-medium mb-1">{info.value}</p>
                            <p className="text-sm text-sage-600">{info.description}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>

              {/* Map placeholder */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                className="mt-8"
              >
                <Card className="overflow-hidden">
                  <div className="h-64 bg-gradient-to-br from-sage-100 to-green-100 flex items-center justify-center">
                    <div className="text-center">
                      <MapPin className="w-12 h-12 text-sage-400 mx-auto mb-4" />
                      <p className="text-sage-600">Interactive map would be integrated here</p>
                      <p className="text-sm text-sage-500">123 Wellness Street, Health City</p>
                    </div>
                  </div>
                </Card>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-sage-25">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-sage-800 mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-lg text-sage-600">
              Quick answers to common questions about Pure Living Pro.
            </p>
          </motion.div>
          
          <div className="space-y-6">
            {faqItems.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <Card className="hover:shadow-md transition-shadow duration-300">
                  <CardHeader>
                    <CardTitle className="text-lg text-sage-800 flex items-start gap-3">
                      <Sparkles className="w-5 h-5 text-sage-500 mt-0.5 flex-shrink-0" />
                      {item.question}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sage-600 leading-relaxed pl-8">
                      {item.answer}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
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
              Still Have Questions?
            </h2>
            <p className="text-lg text-sage-600 mb-8">
              We're here to help! Don't hesitate to reach out with any questions about wellness, 
              our platform, or how we can support your journey.
            </p>
            <Button 
              size="lg"
              onClick={() => window.location.href = "/api/login"}
              className="bg-sage-600 hover:bg-sage-700 text-white px-8 py-4 text-lg font-semibold mr-4"
            >
              Join Our Community
            </Button>
            <Button 
              size="lg"
              variant="outline"
              className="border-sage-600 text-sage-600 hover:bg-sage-50 px-8 py-4 text-lg font-semibold"
            >
              Browse FAQ
            </Button>
          </motion.div>
        </div>
      </section>
    </div>
  );
}