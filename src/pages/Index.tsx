import { Layout } from "@/components/layout";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  Code,
  Settings,
  Users,
  Rocket,
  Building2,
  GraduationCap,
  Briefcase,
  Globe,
  ArrowRight,
  BarChart3,
  Cloud,
  UserCheck,
} from "lucide-react";
import {
  ProcessStep,
  ServiceCard,
  IndustryCard,
  SectionHeader,
} from "@/components/ui/shared-sections";

const Home = () => {
  return (
    <Layout>
      {/* Hero Section */}
      <section className="section-padding pt-32 md:pt-40">
        <div className="container-custom">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h1 className="text-display mb-6">
                Technology, AI & Talent Solutions for Growing Businesses
              </h1>
              <p className="text-body-large mb-8 max-w-lg">
                Vriddhion & Udaanex IT Solutions Pvt Ltd is an IT and consulting
                company delivering technology, AI-driven growth, and skilled talent
                solutions for modern businesses.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link to="/contact" className="btn-gold">
                  Talk to Our Experts
                </Link>
                <Link to="/services" className="btn-outline">
                  View Services
                </Link>
              </div>
            </motion.div>

            {/* Right Content - Dashboard Preview */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="relative"
            >
              <div className="glass-card p-6 rounded-xl">
                {/* Mac window buttons */}
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-3 h-3 rounded-full bg-red-400" />
                  <div className="w-3 h-3 rounded-full bg-yellow-400" />
                  <div className="w-3 h-3 rounded-full bg-green-400" />
                  <span className="ml-4 text-xs text-muted-foreground">
                    Enterprise System View
                  </span>
                </div>

                {/* Dashboard content */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-background rounded-lg p-4">
                    <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
                      <BarChart3 size={14} />
                      <span>Growth Metrics</span>
                    </div>
                    <div className="flex gap-1 h-16 items-end">
                      {[40, 55, 35, 70, 45, 80, 60].map((h, i) => (
                        <div
                          key={i}
                          className="flex-1 bg-muted rounded-t"
                          style={{ height: `${h}%` }}
                        />
                      ))}
                    </div>
                  </div>

                  <div className="bg-background rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs text-muted-foreground">
                        AI Engine
                      </span>
                      <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                        <Settings size={14} className="text-primary" />
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Optimization Active
                    </p>
                  </div>

                  <div className="bg-background rounded-lg p-4 col-span-2 flex items-center gap-3">
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Cloud size={14} />
                      <span>Cloud Infrastructure</span>
                    </div>
                    <div className="flex gap-2 ml-auto">
                      <span className="text-xs px-2 py-1 bg-muted rounded">AWS</span>
                      <span className="text-xs px-2 py-1 bg-muted rounded">Azure</span>
                      <span className="text-xs px-2 py-1 bg-muted rounded">Hybrid</span>
                    </div>
                  </div>

                  <div className="bg-background rounded-lg p-4 col-span-2 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-muted" />
                      <div>
                        <p className="text-sm font-medium">Project Lead</p>
                        <p className="text-xs text-muted-foreground">
                          Talent Deployed
                        </p>
                      </div>
                    </div>
                    <span className="text-xs px-2 py-1 bg-green-100 text-green-700 rounded">
                      ● Active
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="section-padding">
        <div className="container-custom">
          <SectionHeader
            label="OUR EXPERTISE"
            title="Comprehensive IT & Business Solutions"
            description="Driving digital transformation through engineering excellence and strategic consulting."
          />

          <div className="grid md:grid-cols-3 gap-8">
            <ServiceCard
              icon={Code}
              title="IT Services & Engineering"
              items={[
                "Web & App Development",
                "Custom Software Solutions",
                "Cloud Infrastructure & Integrations",
              ]}
              onLinkClick={() => {}}
            />
            <ServiceCard
              icon={Settings}
              title="AI & Business Consulting"
              items={[
                "AI-powered Marketing Systems",
                "Automation & Workflow Optimization",
                "Business Growth Strategy",
              ]}
              onLinkClick={() => {}}
            />
            <ServiceCard
              icon={Users}
              title="Talent & Resource Solutions"
              items={[
                "Skilled Interns & Freelancers",
                "Contract IT Resources",
                "Trainer & Specialist Onboarding",
              ]}
              onLinkClick={() => {}}
            />
          </div>
        </div>
      </section>

      {/* How We Drive Value */}
      <section className="section-padding bg-background">
        <div className="container-custom">
          <SectionHeader
            title="How We Drive Value"
            description="A structured approach to solving complex business challenges."
            centered={false}
          />

          <div className="grid md:grid-cols-4 gap-8 mt-12">
            <ProcessStep
              number="01"
              title="Understand"
              description="We analyze your core business challenges and requirements."
            />
            <ProcessStep
              number="02"
              title="Design"
              description="Architecting scalable technology and AI-driven solutions."
            />
            <ProcessStep
              number="03"
              title="Deploy"
              description="Implementing systems and deploying skilled talent rapidly."
            />
            <ProcessStep
              number="04"
              title="Grow"
              description="Driving measurable growth and optimizing for future scale."
              isLast
            />
          </div>
        </div>
      </section>

      {/* Industries We Serve */}
      <section className="section-padding">
        <div className="container-custom">
          <SectionHeader title="Industries We Serve" centered={false} />

          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <IndustryCard icon={Rocket} title="Startups" />
            <IndustryCard icon={Building2} title="SMEs" />
            <IndustryCard icon={Briefcase} title="Enterprises" />
            <IndustryCard icon={GraduationCap} title="Education" />
            <IndustryCard icon={Globe} title="Digital Business" />
          </div>
        </div>
      </section>

      {/* Education Vertical CTA */}
      <section className="section-slate py-20">
        <div className="container-custom">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <div>
              <span className="text-xs uppercase tracking-widest text-primary mb-2 block">
                TALENT PIPELINE
              </span>
              <h2 className="text-2xl md:text-3xl font-bold text-accent-foreground mb-3">
                Our Education & Training Vertical
              </h2>
              <p className="text-accent-foreground/80 max-w-xl">
                Through <span className="font-semibold">NowRise Institute</span>,
                we train industry-ready talent aligned with real business and
                project needs.
              </p>
            </div>
            <Link
              to="/nowrise-institute"
              className="btn-outline border-accent-foreground text-accent-foreground hover:bg-accent-foreground hover:text-accent whitespace-nowrap"
            >
              Explore NowRise Institute
            </Link>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="section-padding text-center">
        <div className="container-custom max-w-3xl">
          <h2 className="text-heading mb-4">
            Looking for Technology, Talent, or Growth?
          </h2>
          <p className="text-body-large mb-8">
            Partner with Vriddhion & Udaanex IT Solutions for enterprise-grade
            outcomes.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link to="/contact" className="btn-gold">
              Contact Us
            </Link>
            <Link to="/talent-solutions" className="btn-outline">
              Hire Talent
            </Link>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Home;
