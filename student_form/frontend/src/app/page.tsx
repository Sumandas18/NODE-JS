"use client";

import React, { useState, useRef } from "react";

const TABS = [
  { id: "basic", label: "Basic Details" },
  { id: "address", label: "Address Details" },
  { id: "education", label: "Education Details" },
  { id: "submit", label: "Submit Details" },
];

export default function Home() {
  const [activeTab, setActiveTab] = useState("basic");
  const [showPreview, setShowPreview] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const [submitStage, setSubmitStage] = useState<"initial" | "review" | "success">("initial");
  const [isDeclarationChecked, setIsDeclarationChecked] = useState(false);
  
  const pdfRef = useRef<HTMLDivElement>(null);

  const handleDownloadPdf = async () => {
    if (!pdfRef.current) return;
    try {
      setIsGeneratingPdf(true);
      const html2canvas = (await import('html2canvas')).default;
      const { jsPDF } = await import('jspdf');

      // Small delay to ensure any potential reflow is done
      await new Promise(resolve => setTimeout(resolve, 100));

      const canvas = await html2canvas(pdfRef.current, {
        scale: 2,
        useCORS: true,
        backgroundColor: document.documentElement.className.includes('dark') ? '#18181b' : '#ffffff',
      });
      
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      });

      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save('student_application.pdf');
    } catch (error) {
      console.error('Error generating PDF:', error);
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  const handleFinalSubmit = async () => {
    await handleDownloadPdf();
    setSubmitStage("success");
  };

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    dob: "",
    gender: "",
    street: "",
    apartment: "",
    city: "",
    state: "",
    zip: "",
    country: "",
    degree: "",
    institution: "",
    graduationYear: "",
    major: "",
    cgpa: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateTab = (tabId: string) => {
    const newErrors: { [key: string]: string } = {};
    let isValid = true;

    const checkField = (field: string) => {
      if (!formData[field as keyof typeof formData]) {
        newErrors[field] = "need to fill this section";
        isValid = false;
      }
    };

    if (tabId === "basic") {
      ["firstName", "lastName", "email", "phone", "dob", "gender"].forEach(checkField);
    } else if (tabId === "address") {
      ["street", "city", "state", "zip", "country"].forEach(checkField);
    } else if (tabId === "education") {
      ["degree", "institution", "graduationYear", "major", "cgpa"].forEach(checkField);
    }

    setErrors(newErrors);
    return isValid;
  };

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 flex flex-col items-center py-12 px-4 sm:px-6 lg:px-8 font-sans transition-colors duration-300 relative overflow-x-hidden">
      
      {/* Hidden element for PDF generation */}
      <div className="absolute top-[-9999px] left-[-9999px]">
        <div ref={pdfRef} className="bg-white dark:bg-zinc-900 w-[800px] p-10">
          <div className="border-b border-zinc-200 dark:border-zinc-800 pb-6 mb-8 text-center">
            <h1 className="text-3xl font-bold text-zinc-900 dark:text-white">Student Application Form</h1>
            <p className="text-zinc-500 dark:text-zinc-400 mt-2">Official Submission Document</p>
          </div>
          <ApplicationPreviewContent formData={formData} />
        </div>
      </div>

      <div className="w-full max-w-4xl bg-white dark:bg-zinc-900 shadow-xl rounded-2xl overflow-hidden border border-zinc-200 dark:border-zinc-800 transition-all duration-300">
        {/* Header */}
        <div className="bg-blue-600 dark:bg-blue-700 px-8 py-6 text-white text-center">
          <h1 className="text-3xl font-bold tracking-tight">
            Student Application Form
          </h1>
          <p className="mt-2 text-blue-100/80 text-sm">
            Please fill out all the details carefully.
          </p>
        </div>

        {submitStage === "success" ? (
          <div className="p-16 flex flex-col items-center justify-center text-center animate-in fade-in zoom-in duration-500">
            <div className="w-24 h-24 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-12 h-12">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h2 className="text-3xl font-bold text-zinc-900 dark:text-zinc-100 mb-4">Your form has submitted successfully!</h2>
            <p className="text-zinc-600 dark:text-zinc-400 mb-8 max-w-md mx-auto">
              Thank you for verifying your details. A copy of your application has been automatically downloaded to your device as a PDF.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-medium transition-all shadow-md hover:shadow-lg"
            >
              Submit Another Application
            </button>
          </div>
        ) : (
          <>
            {/* Tab Navigation */}
            <div className="border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/50 flex justify-center">
              <nav className="-mb-px flex space-x-2 px-6 overflow-x-auto" aria-label="Tabs">
                {TABS.map((tab) => {
                  const isActive = activeTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => {
                        setActiveTab(tab.id);
                        if (tab.id !== "submit" && submitStage !== "initial") {
                          setSubmitStage("initial");
                          setIsDeclarationChecked(false);
                        }
                      }}
                      className={`
                        whitespace-nowrap py-4 px-6 border-b-2 font-medium text-sm transition-all duration-200 ease-in-out
                        ${
                          isActive
                            ? "border-blue-600 text-blue-600 dark:border-blue-500 dark:text-blue-400"
                            : "border-transparent text-zinc-500 hover:text-zinc-700 hover:border-zinc-300 dark:text-zinc-400 dark:hover:text-zinc-300 dark:hover:border-zinc-700"
                        }
                      `}
                    >
                      {tab.label}
                    </button>
                  );
                })}
              </nav>
            </div>

            {/* Form Content Area */}
            <div className="p-8 sm:p-10">
              <form className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500" onSubmit={(e) => e.preventDefault()}>
                {activeTab === "basic" && <BasicDetailsTab formData={formData} handleChange={handleChange} errors={errors} />}
                {activeTab === "address" && <AddressDetailsTab formData={formData} handleChange={handleChange} errors={errors} />}
                {activeTab === "education" && <EducationDetailsTab formData={formData} handleChange={handleChange} errors={errors} />}
                {activeTab === "submit" && (
                  <SubmitDetailsTab 
                    submitStage={submitStage} 
                    isDeclarationChecked={isDeclarationChecked} 
                    setIsDeclarationChecked={setIsDeclarationChecked} 
                  />
                )}

                {/* Form Actions (Prev/Next) */}
                <div className="mt-10 pt-6 border-t border-zinc-200 dark:border-zinc-800 flex justify-between items-center">
                  <button
                    type="button"
                    onClick={() => {
                      const currentIndex = TABS.findIndex((t) => t.id === activeTab);
                      if (currentIndex > 0) setActiveTab(TABS[currentIndex - 1].id);
                    }}
                    disabled={activeTab === TABS[0].id}
                    className="px-6 py-2.5 border border-zinc-300 dark:border-zinc-700 rounded-lg text-sm font-medium text-zinc-700 dark:text-zinc-300 bg-white dark:bg-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    Previous
                  </button>
                  {activeTab !== "submit" ? (
                    <button
                    type="button"
                    onClick={() => {
                      const currentIndex = TABS.findIndex((t) => t.id === activeTab);
                      if (currentIndex < TABS.length - 1) {
                        const isValid = validateTab(activeTab);
                        if (isValid) {
                          setActiveTab(TABS[currentIndex + 1].id);
                          setErrors({}); // Clear errors when proceeding
                        }
                      }
                    }}
                    className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors shadow-md hover:shadow-lg"
                  >
                    Next Step
                  </button>
                  ) : (
                    <div className="flex gap-3">
                      {submitStage === "initial" && (
                        <button
                          type="button"
                          onClick={() => setSubmitStage("review")}
                          className="px-8 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors shadow-md hover:shadow-lg"
                        >
                          Submit
                        </button>
                      )}
                      {submitStage === "review" && (
                        <>
                          <button
                            type="button"
                            onClick={() => setShowPreview(true)}
                            className="flex items-center gap-2 px-6 py-2.5 bg-white border border-zinc-300 dark:bg-zinc-800 dark:border-zinc-700 hover:bg-zinc-50 dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-300 rounded-lg text-sm font-medium transition-colors shadow-sm"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m.75 12l3 3m0 0l3-3m-3 3v-6m-1.5-9H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                            </svg>
                            Preview
                          </button>
                          {isDeclarationChecked && (
                            <button
                              type="button"
                              onClick={handleFinalSubmit}
                              disabled={isGeneratingPdf}
                              className="px-8 py-2.5 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm font-medium transition-colors shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              {isGeneratingPdf ? "Processing..." : "Final Submit"}
                            </button>
                          )}
                        </>
                      )}
                    </div>
                  )}
                </div>
              </form>
            </div>
          </>
        )}
      </div>

      {/* Preview Modal */}
      {showPreview && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col border border-zinc-200 dark:border-zinc-800">
            <div className="bg-white dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800 px-6 py-4 flex justify-between items-center z-10 rounded-t-2xl shrink-0">
              <h3 className="text-xl font-bold text-zinc-900 dark:text-white">Application Preview</h3>
              <button 
                onClick={() => setShowPreview(false)}
                className="text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-200 transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="overflow-y-auto p-6">
              <ApplicationPreviewContent formData={formData} />
            </div>
            
            <div className="bg-zinc-50 dark:bg-zinc-900 border-t border-zinc-200 dark:border-zinc-800 px-6 py-4 flex justify-end gap-3 rounded-b-2xl z-10 shrink-0">
              <button
                onClick={() => setShowPreview(false)}
                className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors shadow-sm hover:shadow-md"
              >
                Close Preview
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function ApplicationPreviewContent({ formData }: { formData: { [key: string]: string } }) {
  return (
    <div className="space-y-8">
      {/* Basic Details Preview */}
      <div>
        <h4 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100 border-b border-zinc-200 dark:border-zinc-800 pb-2 mb-4">Basic Information</h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-6">
          <PreviewItem label="First Name" value={formData.firstName} />
          <PreviewItem label="Last Name" value={formData.lastName} />
          <PreviewItem label="Email Address" value={formData.email} />
          <PreviewItem label="Phone Number" value={formData.phone} />
          <PreviewItem label="Date of Birth" value={formData.dob} />
          <PreviewItem label="Gender" value={formData.gender} />
        </div>
      </div>

      {/* Address Details Preview */}
      <div>
        <h4 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100 border-b border-zinc-200 dark:border-zinc-800 pb-2 mb-4">Address Information</h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-6">
          <PreviewItem label="Street Address" value={formData.street} className="sm:col-span-2" />
          <PreviewItem label="Apartment/Suite" value={formData.apartment} className="sm:col-span-2" />
          <PreviewItem label="City" value={formData.city} />
          <PreviewItem label="State / Province" value={formData.state} />
          <PreviewItem label="ZIP / Postal Code" value={formData.zip} />
          <PreviewItem label="Country" value={formData.country} />
        </div>
      </div>

      {/* Education Details Preview */}
      <div>
        <h4 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100 border-b border-zinc-200 dark:border-zinc-800 pb-2 mb-4">Educational Background</h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-6">
          <PreviewItem label="Degree Level" value={formData.degree} />
          <PreviewItem label="Institution Name" value={formData.institution} />
          <PreviewItem label="Year of Graduation" value={formData.graduationYear} />
          <PreviewItem label="Major / Field of Study" value={formData.major} />
          <PreviewItem label="CGPA / Percentage" value={formData.cgpa} />
        </div>
      </div>
    </div>
  );
}

function PreviewItem({ label, value, className = "" }: { label: string; value: string; className?: string }) {
  return (
    <div className={`flex flex-col ${className}`}>
      <span className="text-sm text-zinc-500 dark:text-zinc-400">{label}</span>
      <span className="font-medium text-zinc-900 dark:text-zinc-100 break-words">{value || "—"}</span>
    </div>
  );
}

// --- Tab Components Placeholder --- //

function BasicDetailsTab({ formData, handleChange, errors }: { formData: { [key: string]: string }; handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void; errors: { [key: string]: string } }) {
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100 border-b border-zinc-200 dark:border-zinc-800 pb-2">
        Basic Information
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <InputField label="First Name" name="firstName" value={formData.firstName} onChange={handleChange} placeholder="e.g. John" error={errors.firstName} required />
        <InputField label="Last Name" name="lastName" value={formData.lastName} onChange={handleChange} placeholder="e.g. Doe" error={errors.lastName} required />
        <InputField
          label="Email Address"
          name="email"
          value={formData.email} onChange={handleChange}
          type="email"
          placeholder="john.doe@example.com"
          error={errors.email}
          required
        />
        <InputField
          label="Phone Number"
          name="phone"
          value={formData.phone} onChange={handleChange}
          type="tel"
          placeholder="+1 (555) 000-0000"
          error={errors.phone}
          required
        />
        <InputField label="Date of Birth" name="dob" value={formData.dob} onChange={handleChange} type="date" error={errors.dob} required />
        <SelectField
          label="Gender"
          name="gender"
          value={formData.gender} onChange={handleChange}
          options={["Male", "Female", "Other", "Prefer not to say"]}
          error={errors.gender}
          required
        />
      </div>
    </div>
  );
}

function AddressDetailsTab({ formData, handleChange, errors }: { formData: { [key: string]: string }; handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void; errors: { [key: string]: string } }) {
  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100 border-b border-zinc-200 dark:border-zinc-800 pb-2">
        Address Information
      </h2>
      <div className="space-y-6">
        <InputField
          label="Street Address"
          name="street"
          value={formData.street} onChange={handleChange}
          placeholder="123 Main St"
          error={errors.street}
          required
          fullWidth
        />
        <InputField
          label="Apartment, suite, etc. (optional)"
          name="apartment"
          value={formData.apartment} onChange={handleChange}
          placeholder="Apt 4B"
          fullWidth
        />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <InputField label="City" name="city" value={formData.city} onChange={handleChange} placeholder="New York" error={errors.city} required />
          <InputField label="State / Province" name="state" value={formData.state} onChange={handleChange} placeholder="NY" error={errors.state} required />
          <InputField label="ZIP / Postal Code" name="zip" value={formData.zip} onChange={handleChange} placeholder="10001" error={errors.zip} required />
        </div>
        <SelectField
          label="Country"
          name="country"
          value={formData.country} onChange={handleChange}
          options={[
            "United States",
            "India",
            "Canada",
            "United Kingdom",
            "Australia",
          ]}
          error={errors.country}
          required
          fullWidth
        />
      </div>
    </div>
  );
}

function EducationDetailsTab({ formData, handleChange, errors }: { formData: { [key: string]: string }; handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void; errors: { [key: string]: string } }) {
  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100 border-b border-zinc-200 dark:border-zinc-800 pb-2">
        Educational Background
      </h2>

      <div className="bg-zinc-50 dark:bg-zinc-800/50 p-6 rounded-xl border border-zinc-200 dark:border-zinc-800">
        <h3 className="font-medium text-zinc-900 dark:text-zinc-100 mb-4 text-sm uppercase tracking-wider">
          Highest Degree
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <SelectField
            label="Degree Level"
            name="degree"
            value={formData.degree} onChange={handleChange}
            options={["High School", "Bachelor's", "Master's", "PhD"]}
            error={errors.degree}
            required
          />
          <InputField
            label="Institution Name"
            name="institution"
            value={formData.institution} onChange={handleChange}
            placeholder="e.g. MIT"
            error={errors.institution}
            required
          />
          <InputField
            label="Year of Graduation"
            name="graduationYear"
            value={formData.graduationYear} onChange={handleChange}
            type="number"
            placeholder="YYYY"
            error={errors.graduationYear}
            required
          />
          <InputField
            label="Major / Field of Study"
            name="major"
            value={formData.major} onChange={handleChange}
            placeholder="Computer Science"
            error={errors.major}
            required
          />
          <InputField
            label="CGPA / Percentage"
            name="cgpa"
            value={formData.cgpa} onChange={handleChange}
            placeholder="e.g. 3.8 or 85%"
            error={errors.cgpa}
            required
          />
        </div>
      </div>
    </div>
  );
}

function SubmitDetailsTab({ 
  submitStage, 
  isDeclarationChecked, 
  setIsDeclarationChecked 
}: { 
  submitStage: "initial" | "review" | "success";
  isDeclarationChecked: boolean;
  setIsDeclarationChecked: (val: boolean) => void;
}) {
  return (
    <div className="space-y-6 animate-in fade-in duration-300 flex flex-col items-center text-center justify-center py-8">
      <div className="w-20 h-20 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full flex items-center justify-center mb-4">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={2}
          stroke="currentColor"
          className="w-10 h-10"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      </div>
      <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">
        Almost Done!
      </h2>
      <p className="text-zinc-600 dark:text-zinc-400 max-w-md mx-auto">
        {submitStage === "initial" 
          ? "Please review all the information you have provided in the previous tabs. Click the \"Submit\" button below to review your document."
          : "Please carefully read and accept the declaration below before making your final submission. You can also preview your document."}
      </p>

      {submitStage === "review" && (
        <label className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800/50 rounded-lg p-5 mt-8 max-w-lg w-full text-left flex gap-3 cursor-pointer group">
          <div className="pt-1">
            <input
              type="checkbox"
              checked={isDeclarationChecked}
              onChange={(e) => setIsDeclarationChecked(e.target.checked)}
              className="w-5 h-5 rounded border-amber-300 text-amber-600 focus:ring-amber-500 dark:border-amber-700 dark:bg-zinc-800 cursor-pointer"
            />
          </div>
          <div>
            <h4 className="text-sm font-semibold text-amber-800 dark:text-amber-400 group-hover:text-amber-900 dark:group-hover:text-amber-300 transition-colors">
              Declaration
            </h4>
            <p className="text-sm text-amber-700 dark:text-amber-500/80 mt-1 leading-relaxed">
              By submitting this form, I declare that all the information provided
              is true and correct to the best of my knowledge. I understand that any false information may result in rejection of my application.
            </p>
          </div>
        </label>
      )}
    </div>
  );
}

// --- Reusable Form Components --- //

function InputField({
  label,
  name,
  value,
  onChange,
  placeholder,
  type = "text",
  required = false,
  fullWidth = false,
  error,
}: {
  label: string;
  name?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  type?: string;
  required?: boolean;
  fullWidth?: boolean;
  error?: string;
}) {
  return (
    <div
      className={`flex flex-col gap-1.5 ${fullWidth ? "md:col-span-2" : ""}`}
    >
      <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={`px-4 py-2.5 rounded-lg border bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 dark:placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors shadow-sm ${
          error ? "border-red-500 focus:ring-red-500 focus:border-red-500" : "border-zinc-300 dark:border-zinc-700"
        }`}
        required={required}
      />
      {error && <span className="text-red-500 text-xs mt-1">{error}</span>}
    </div>
  );
}

function SelectField({
  label,
  name,
  value,
  onChange,
  options,
  required = false,
  fullWidth = false,
  error,
}: {
  label: string;
  name?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  options: string[];
  required?: boolean;
  fullWidth?: boolean;
  error?: string;
}) {
  return (
    <div
      className={`flex flex-col gap-1.5 ${fullWidth ? "md:col-span-2" : ""}`}
    >
      <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <select
        name={name}
        value={value}
        onChange={onChange}
        className={`px-4 py-2.5 rounded-lg border bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors shadow-sm appearance-none ${
          error ? "border-red-500 focus:ring-red-500 focus:border-red-500" : "border-zinc-300 dark:border-zinc-700"
        }`}
        required={required}
      >
        <option value="" disabled>
          Select {label}
        </option>
        {options.map((opt, i) => (
          <option key={i} value={opt}>
            {opt}
          </option>
        ))}
      </select>
      {error && <span className="text-red-500 text-xs mt-1">{error}</span>}
    </div>
  );
}
