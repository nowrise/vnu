import { Layout } from "@/components/layout";
import { motion } from "framer-motion";
import { Code, Settings, Lightbulb, ArrowRight } from "lucide-react";
import { ProcessStep, SectionHeader } from "@/components/ui/shared-sections";
import heroServices from "@/assets/hero-services.jpg";

const serviceCards = [
  {
    icon: Code,
    title: "IT & Software Development",
    items: ["Web applications", "Mobile apps", "Custom platforms"],
  },
  {
    icon: Settings,
    title: "AI & Automation",
    items: ["AI marketing systems", "Chatbots & CRM automation", "Workflow automation"],
  },
  {
    icon: Lightbulb,
    title: "Consulting & Strategy",
    items: ["Digital transformation", "Tech advisory", "Process optimization"],
  },
];

const Services = () => {
  return (
    <Layout>
      {/* Hero Section */}
      <section className="section-padding pt-32 md:pt-40">
        <div className="container-custom">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h1 className="text-display mb-6">Our IT Services</h1>
              <p className="text-body-large">
                Scalable technology solutions designed to support business growth.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <img
                src={heroServices}
                alt="AI Technology Visualization"
                className="rounded-xl shadow-hover w-full"
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Service Cards */}
      <section className="section-padding section-taupe">
        <div className="container-custom">
          <div className="grid md:grid-cols-3 gap-8">
            {serviceCards.map((service, index) => (
              <motion.div
                key={service.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="service-card card-hover"
              >
                <div className="w-10 h-10 rounded-lg bg-background flex items-center justify-center mb-6">
                  <service.icon size={20} className="text-foreground" />
                </div>
                <h3 className="text-xl font-semibold mb-4">{service.title}</h3>
                <ul className="space-y-3">
                  {service.items.map((item, i) => (
                    <li
                      key={i}
                      className="flex items-center gap-2 text-sm text-muted-foreground"
                    >
                      <ArrowRight size={14} className="text-primary" />
                      {item}
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Engagement Model */}
      <section className="section-padding">
        <div className="container-custom">
          <SectionHeader
            title="Engagement Model"
            description="Our structured approach ensures clarity and consistent delivery."
            centered={false}
          />

          <div className="grid md:grid-cols-4 gap-8 mt-12">
            <ProcessStep
              number="01"
              title="Consultation"
              description="Deep dive understanding of requirements and strategic alignment."
            />
            <ProcessStep
              number="02"
              title="Solution Design"
              description="Architecting scalable frameworks tailored to your needs."
            />
            <ProcessStep
              number="03"
              title="Execution"
              description="Agile implementation focusing on quality and speed."
            />
            <ProcessStep
              number="04"
              title="Support & Scaling"
              description="Continuous optimization and growth support."
              isLast
            />
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Services;
