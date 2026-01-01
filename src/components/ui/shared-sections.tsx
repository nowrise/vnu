import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";

interface ProcessStepProps {
  number: string;
  title: string;
  description: string;
  isLast?: boolean;
}

export const ProcessStep = ({
  number,
  title,
  description,
  isLast = false,
}: ProcessStepProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="flex-1 relative"
    >
      <div className="flex items-center mb-6">
        <div className="process-number">{number}</div>
        {!isLast && (
          <div className="hidden md:block flex-1 h-px bg-border ml-4" />
        )}
      </div>
      <h3 className="font-semibold text-lg mb-2">{title}</h3>
      <p className="text-muted-foreground text-sm leading-relaxed">
        {description}
      </p>
    </motion.div>
  );
};

interface ServiceCardProps {
  icon: LucideIcon;
  title: string;
  items: string[];
  linkText?: string;
  onLinkClick?: () => void;
}

export const ServiceCard = ({
  icon: Icon,
  title,
  items,
  linkText = "Learn More →",
  onLinkClick,
}: ServiceCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="service-card card-hover"
    >
      <div className="w-10 h-10 rounded-lg bg-background flex items-center justify-center mb-6">
        <Icon size={20} className="text-foreground" />
      </div>
      <h3 className="text-subheading mb-4">{title}</h3>
      <ul className="space-y-3 mb-6">
        {items.map((item, index) => (
          <li key={index} className="flex items-start gap-2 text-sm text-muted-foreground">
            <span className="text-primary">✓</span>
            {item}
          </li>
        ))}
      </ul>
      {onLinkClick && (
        <button
          onClick={onLinkClick}
          className="text-sm font-medium text-foreground hover:text-primary transition-colors"
        >
          {linkText}
        </button>
      )}
    </motion.div>
  );
};

interface IndustryCardProps {
  icon: LucideIcon;
  title: string;
}

export const IndustryCard = ({ icon: Icon, title }: IndustryCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4 }}
      className="industry-card flex flex-col items-center text-center"
    >
      <Icon size={28} className="mb-3 text-foreground" />
      <span className="font-medium text-sm">{title}</span>
    </motion.div>
  );
};

interface SectionHeaderProps {
  label?: string;
  title: string;
  description?: string;
  centered?: boolean;
  light?: boolean;
}

export const SectionHeader = ({
  label,
  title,
  description,
  centered = true,
  light = false,
}: SectionHeaderProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className={`mb-12 ${centered ? "text-center max-w-3xl mx-auto" : ""}`}
    >
      {label && (
        <span className={`text-label mb-4 block ${light ? "text-primary" : ""}`}>
          {label}
        </span>
      )}
      <h2 className={`text-heading mb-4 ${light ? "text-accent-foreground" : ""}`}>
        {title}
      </h2>
      {description && (
        <p className={`text-body-large ${light ? "text-accent-foreground/80" : ""}`}>
          {description}
        </p>
      )}
    </motion.div>
  );
};
