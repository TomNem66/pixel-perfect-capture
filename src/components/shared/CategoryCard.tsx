import React from "react";

interface CategoryCardProps {
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
}

export const CategoryCard = ({ icon, title, children }: CategoryCardProps) => (
  <div className="rounded-xl border border-border/60 bg-card p-5">
    <div className="flex items-center gap-3 mb-4">
      {icon}
      <h3 className="font-heading font-semibold text-lg">{title}</h3>
    </div>
    <div className="divide-y divide-border/30">
      {children}
    </div>
  </div>
);
