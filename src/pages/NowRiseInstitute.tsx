import { Layout } from "@/components/layout";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Code, Briefcase, Award } from "lucide-react";
import { SectionHeader } from "@/components/ui/shared-sections";
import heroNowrise from "@/assets/hero-nowrise.jpg";

const programs = [
  {
    icon: Code,
    title: "Skill Development Programs",
    description:
      "Intensive technical training modules covering modern software engineering, data science, and AI application stacks.",
  },
  {
    icon: Briefcase,
    title: "Internships",
    description:
      "Practical exposure to live business environments, allowing talent to apply theoretical knowledge to real-world challenges.",
  },
  {
    icon: Award,
    title: "Certification Tracks",
    description:
      "Validated competency assessments and industry-recognized credentials that benchmark professional expertise.",
  },
];

const NowRiseInstitute = () => {
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
              <h1 className="text-display mb-6">
                Industry-Aligned Training & Skill Development
              </h1>
              <p className="text-body-large">
                NowRise Institute is our education arm focused on preparing talent
                for real-world industry requirements.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <img
                src={heroNowrise}
                alt="Analytics Dashboard"
                className="rounded-xl shadow-hover w-full"
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Our Programs */}
      <section className="section-padding">
        <div className="container-custom">
          <SectionHeader
            title="Our Programs"
            description="Comprehensive education pathways built for the modern digital economy."
            centered={false}
          />

          <div className="grid md:grid-cols-3 gap-8 mt-12">
            {programs.map((program, index) => (
              <motion.div
                key={program.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="service-card card-hover"
              >
                <div className="w-10 h-10 rounded-lg bg-background flex items-center justify-center mb-6">
                  <program.icon size={20} className="text-foreground" />
                </div>
                <h3 className="text-xl font-semibold mb-3">{program.title}</h3>
                <p className="text-muted-foreground text-sm">
                  {program.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Aligned with Industry */}
      <section className="section-padding bg-background">
        <div className="container-custom">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="max-w-2xl">
              <h2 className="text-heading mb-4">Aligned with Industry Needs</h2>
              <p className="text-body-large">
                Our training programs are designed in alignment with real business
                projects and talent requirements from Vriddhion & Udaanex.
              </p>
            </div>
            <Link to="/contact" className="btn-gold whitespace-nowrap">
              View Programs
            </Link>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default NowRiseInstitute;
