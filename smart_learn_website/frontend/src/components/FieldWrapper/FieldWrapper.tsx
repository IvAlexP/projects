import React from "react";

type FieldWrapperProps = {
  label: string;
  error?: string;
  children: React.ReactNode;
};

export const FieldWrapper = ({ label, error, children }: FieldWrapperProps) => {
  return (
    <div>
      <label className="label">{label}</label>
      {children}
      {error && <span className="errorMessage">{error}</span>}
    </div>
  );
};
