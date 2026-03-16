"use client";

import React, { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import api from "@/lib/api";
import { LogOut, Users, UserCircle2, Search, Edit2, Trash2, PlusCircle, Building, Loader2, X, WalletCards, ArrowUpRight, ArrowDownRight } from "lucide-react";

interface Employee {
  _id: string;
  emp_name: string;
  emp_email: string;
  emp_department: string;
  is_admin: string;
}

interface Salary {
  _id: string;
  emp_name: string;
  basic_salary: number;
  bonus: number;
  deduction: number;
  month: string;
  year: string;
  created_by?: string;
}

export default function DashboardPage() {
  const { user, logout, loading: authLoading } = useAuth();
  const router = useRouter();

  const [currentTab, setCurrentTab] = useState<"directory" | "salary">("directory");

  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  const [salaries, setSalaries] = useState<Salary[]>([]);
  const [loadingSalaries, setLoadingSalaries] = useState(false);

  const [isAddUserOpen, setIsAddUserOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [addForm, setAddForm] = useState({
    emp_name: "",
    emp_email: "",
    emp_password: "",
    emp_department: "",
    is_admin: "employee",
  });

  const [isAddSalaryOpen, setIsAddSalaryOpen] = useState(false);
  const [salaryForm, setSalaryForm] = useState({
    emp_name: "",
    basic_salary: "",
    bonus: "",
    deduction: "",
    month: "January",
    year: new Date().getFullYear().toString(),
  });

  const [isEditUserOpen, setIsEditUserOpen] = useState(false);
  const [editForm, setEditForm] = useState({
    _id: "",
    emp_name: "",
    emp_email: "",
    emp_department: "",
    is_admin: "employee",
  });

  const [isEditSalaryOpen, setIsEditSalaryOpen] = useState(false);
  const [editSalaryForm, setEditSalaryForm] = useState({
    _id: "",
    emp_name: "",
    basic_salary: "",
    bonus: "",
    deduction: "",
    month: "January",
    year: new Date().getFullYear().toString(),
  });

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login");
    }
  }, [user, authLoading, router]);

  const fetchEmployees = async () => {
    try {
      setLoading(true);
      const res = await api.get("/employee");
      if (res.data.status) {
        setEmployees(res.data.data);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to load employee data.");
    } finally {
      setLoading(false);
    }
  };

  const fetchSalaries = async () => {
    try {
      setLoadingSalaries(true);
      const res = await api.get("/empSalaries");
      if (res.data.status) {
        setSalaries(res.data.data);
      }
    } catch (err: any) {
      console.error(err);
    } finally {
      setLoadingSalaries(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchEmployees();
      if (user.is_admin === "admin" || user.is_admin === "manager") {
        fetchSalaries();
      }
    }
  }, [user]);

  const handleDeleteEmployee = async (id: string) => {
    if (!confirm("Are you sure you want to delete this employee?")) return;
    try {
      const res = await api.delete(`/employee/${id}`);
      if (res.data.status) {
        fetchEmployees();
      }
    } catch (err: any) {
      alert(err.response?.data?.message || "Failed to delete employee.");
    }
  };

  const handleAddUserSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const res = await api.post("/create/employee", addForm);
      if (res.data.status) {
        setIsAddUserOpen(false);
        setAddForm({ emp_name: "", emp_email: "", emp_password: "", emp_department: "", is_admin: "employee" });
        fetchEmployees();
      }
    } catch (err: any) {
      alert(err.response?.data?.message || "Failed to add employee.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const openEditUserModal = (emp: Employee) => {
    setEditForm({
      _id: emp._id,
      emp_name: emp.emp_name,
      emp_email: emp.emp_email,
      emp_department: emp.emp_department,
      is_admin: emp.is_admin,
    });
    setIsEditUserOpen(true);
  };

  const handleEditUserSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const { _id, ...updateData } = editForm;
      const res = await api.put(`/employee/${_id}`, updateData);
      if (res.data.status) {
        setIsEditUserOpen(false);
        fetchEmployees();
      }
    } catch (err: any) {
      alert(err.response?.data?.message || "Failed to update employee.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAddSalarySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const payload = {
        ...salaryForm,
        basic_salary: Number(salaryForm.basic_salary),
        bonus: Number(salaryForm.bonus),
        deduction: Number(salaryForm.deduction)
      };
      const res = await api.post("/create/empSalary", payload);
      if (res.data.status) {
        setIsAddSalaryOpen(false);
        setSalaryForm({ emp_name: "", basic_salary: "", bonus: "", deduction: "", month: "January", year: new Date().getFullYear().toString() });
        fetchSalaries();
      }
    } catch (err: any) {
      alert(err.response?.data?.message || "Failed to add salary record.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const openEditSalaryModal = (sal: Salary) => {
    setEditSalaryForm({
      _id: sal._id,
      emp_name: sal.emp_name,
      basic_salary: sal.basic_salary.toString(),
      bonus: sal.bonus.toString(),
      deduction: sal.deduction.toString(),
      month: sal.month,
      year: sal.year,
    });
    setIsEditSalaryOpen(true);
  };

  const handleEditSalarySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const { _id, ...updateData } = editSalaryForm;
      const payload = {
        ...updateData,
        basic_salary: Number(updateData.basic_salary),
        bonus: Number(updateData.bonus),
        deduction: Number(updateData.deduction)
      };
      const res = await api.put(`/empSalary/${_id}`, payload);
      if (res.data.status) {
        setIsEditSalaryOpen(false);
        fetchSalaries();
      }
    } catch (err: any) {
      alert(err.response?.data?.message || "Failed to update salary.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteSalary = async (id: string) => {
    if (!confirm("Are you sure you want to delete this salary record?")) return;
    try {
      const res = await api.delete(`/empSalary/${id}`);
      if (res.data.status) {
        fetchSalaries();
      }
    } catch (err: any) {
      alert(err.response?.data?.message || "Failed to delete salary record.");
    }
  };

  if (authLoading || !user) {
    return (
      <div className="min-h-screen bg-[#050505] flex items-center justify-center">
        <Loader2 size={48} className="animate-spin text-zinc-500" />
      </div>
    );
  }

  const filteredEmployees = employees.filter((emp) =>
    emp.emp_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    emp.emp_department.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredSalaries = salaries.filter((sal) =>
    sal.emp_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#050505] text-zinc-100 font-sans selection:bg-zinc-800">

      {isAddUserOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-[#0a0a0a] border border-zinc-800 rounded-2xl w-full max-w-md shadow-2xl overflow-hidden animate-in zoom-in-95">
            <div className="flex items-center justify-between p-5 border-b border-zinc-900">
              <h2 className="text-lg font-semibold text-white">Add New User</h2>
              <button onClick={() => setIsAddUserOpen(false)} className="text-zinc-500 hover:text-white transition-colors" type="button">
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleAddUserSubmit} className="p-5 space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-zinc-500 uppercase flex items-center gap-1.5"><UserCircle2 size={12}/> Full Name</label>
                <input type="text" required value={addForm.emp_name} onChange={(e) => setAddForm({...addForm, emp_name: e.target.value})} className="w-full px-3 py-2 rounded-lg bg-black border border-zinc-800 focus:border-zinc-500 outline-none text-sm text-white transition-colors placeholder:text-zinc-600" placeholder="John Doe" />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-semibold text-zinc-500 uppercase flex items-center gap-1.5">Email</label>
                <input type="email" required value={addForm.emp_email} onChange={(e) => setAddForm({...addForm, emp_email: e.target.value})} className="w-full px-3 py-2 rounded-lg bg-black border border-zinc-800 focus:border-zinc-500 outline-none text-sm text-white transition-colors placeholder:text-zinc-600" placeholder="john@company.com" />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-semibold text-zinc-500 uppercase flex items-center gap-1.5"><Building size={12}/> Department</label>
                <input type="text" required value={addForm.emp_department} onChange={(e) => setAddForm({...addForm, emp_department: e.target.value})} className="w-full px-3 py-2 rounded-lg bg-black border border-zinc-800 focus:border-zinc-500 outline-none text-sm text-white transition-colors placeholder:text-zinc-600" placeholder="Engineering" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-zinc-500 uppercase">Temp Password</label>
                  <input type="password" required minLength={6} value={addForm.emp_password} onChange={(e) => setAddForm({...addForm, emp_password: e.target.value})} className="w-full px-3 py-2 rounded-lg bg-black border border-zinc-800 focus:border-zinc-500 outline-none text-sm text-white transition-colors placeholder:text-zinc-600" placeholder="••••••••" />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-zinc-500 uppercase">Role</label>
                  <select value={addForm.is_admin} onChange={(e) => setAddForm({...addForm, is_admin: e.target.value})} className="w-full px-3 py-2 rounded-lg bg-black border border-zinc-800 focus:border-zinc-500 outline-none text-sm text-white transition-colors cursor-pointer">
                    <option value="employee">Employee</option>
                    <option value="manager">Manager</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>
              </div>
              <div className="pt-4 flex items-center justify-end gap-3">
                <button type="button" onClick={() => setIsAddUserOpen(false)} className="px-4 py-2 text-sm font-medium text-zinc-400 hover:text-white transition-colors">Cancel</button>
                <button type="submit" disabled={isSubmitting} className="px-4 py-2 bg-white text-black hover:bg-zinc-200 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 disabled:opacity-50">
                  {isSubmitting ? <Loader2 size={16} className="animate-spin" /> : "Save User"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {isAddSalaryOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-[#0a0a0a] border border-zinc-800 rounded-2xl w-full max-w-md shadow-2xl overflow-hidden animate-in zoom-in-95">
            <div className="flex items-center justify-between p-5 border-b border-zinc-900">
              <h2 className="text-lg font-semibold text-white">Add Salary Record</h2>
              <button onClick={() => setIsAddSalaryOpen(false)} className="text-zinc-500 hover:text-white transition-colors" type="button">
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleAddSalarySubmit} className="p-5 space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-zinc-500 uppercase flex items-center gap-1.5"><UserCircle2 size={12}/> Employee Name</label>
                <select required value={salaryForm.emp_name} onChange={(e) => setSalaryForm({...salaryForm, emp_name: e.target.value})} className="w-full px-3 py-2 rounded-lg bg-black border border-zinc-800 focus:border-zinc-500 outline-none text-sm text-white transition-colors cursor-pointer">
                  <option value="" disabled>Select an employee</option>
                  {employees.map((emp) => (
                    <option key={`add-sal-${emp._id}`} value={emp.emp_name}>{emp.emp_name}</option>
                  ))}
                </select>
              </div>
              
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-zinc-500 uppercase">Basic ($)</label>
                  <input type="number" required min="0" value={salaryForm.basic_salary} onChange={(e) => setSalaryForm({...salaryForm, basic_salary: e.target.value})} className="w-full px-3 py-2 rounded-lg bg-black border border-zinc-800 focus:border-zinc-500 outline-none text-sm text-white transition-colors placeholder:text-zinc-600" placeholder="5000" />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-zinc-500 uppercase">Bonus ($)</label>
                  <input type="number" required min="0" value={salaryForm.bonus} onChange={(e) => setSalaryForm({...salaryForm, bonus: e.target.value})} className="w-full px-3 py-2 rounded-lg bg-black border border-zinc-800 focus:border-zinc-500 outline-none text-sm text-white transition-colors placeholder:text-zinc-600" placeholder="500" />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-zinc-500 uppercase">Subtract ($)</label>
                  <input type="number" required min="0" value={salaryForm.deduction} onChange={(e) => setSalaryForm({...salaryForm, deduction: e.target.value})} className="w-full px-3 py-2 rounded-lg bg-black border border-zinc-800 focus:border-zinc-500 outline-none text-sm text-white transition-colors placeholder:text-zinc-600" placeholder="100" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-zinc-500 uppercase">Month</label>
                  <select value={salaryForm.month} onChange={(e) => setSalaryForm({...salaryForm, month: e.target.value})} className="w-full px-3 py-2 rounded-lg bg-black border border-zinc-800 focus:border-zinc-500 outline-none text-sm text-white transition-colors cursor-pointer">
                    {['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'].map(m => (
                      <option key={m} value={m}>{m}</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-zinc-500 uppercase">Year</label>
                  <input type="number" required value={salaryForm.year} onChange={(e) => setSalaryForm({...salaryForm, year: e.target.value})} className="w-full px-3 py-2 rounded-lg bg-black border border-zinc-800 focus:border-zinc-500 outline-none text-sm text-white transition-colors placeholder:text-zinc-600" placeholder="2023" />
                </div>
              </div>

              <div className="pt-4 flex items-center justify-end gap-3">
                <button type="button" onClick={() => setIsAddSalaryOpen(false)} className="px-4 py-2 text-sm font-medium text-zinc-400 hover:text-white transition-colors">Cancel</button>
                <button type="submit" disabled={isSubmitting} className="px-4 py-2 bg-white text-black hover:bg-zinc-200 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 disabled:opacity-50">
                  {isSubmitting ? <Loader2 size={16} className="animate-spin" /> : "Save Record"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {isEditUserOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-[#0a0a0a] border border-zinc-800 rounded-2xl w-full max-w-md shadow-2xl overflow-hidden animate-in zoom-in-95">
            <div className="flex items-center justify-between p-5 border-b border-zinc-900">
              <h2 className="text-lg font-semibold text-white">Edit User</h2>
              <button onClick={() => setIsEditUserOpen(false)} className="text-zinc-500 hover:text-white transition-colors" type="button">
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleEditUserSubmit} className="p-5 space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-zinc-500 uppercase flex items-center gap-1.5"><UserCircle2 size={12}/> Full Name</label>
                <input type="text" required value={editForm.emp_name} onChange={(e) => setEditForm({...editForm, emp_name: e.target.value})} className="w-full px-3 py-2 rounded-lg bg-black border border-zinc-800 focus:border-zinc-500 outline-none text-sm text-white transition-colors placeholder:text-zinc-600" placeholder="John Doe" />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-semibold text-zinc-500 uppercase flex items-center gap-1.5">Email</label>
                <input type="email" required value={editForm.emp_email} onChange={(e) => setEditForm({...editForm, emp_email: e.target.value})} className="w-full px-3 py-2 rounded-lg bg-black border border-zinc-800 focus:border-zinc-500 outline-none text-sm text-white transition-colors placeholder:text-zinc-600" placeholder="john@company.com" disabled />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-zinc-500 uppercase flex items-center gap-1.5"><Building size={12}/> Department</label>
                  <input type="text" required value={editForm.emp_department} onChange={(e) => setEditForm({...editForm, emp_department: e.target.value})} className="w-full px-3 py-2 rounded-lg bg-black border border-zinc-800 focus:border-zinc-500 outline-none text-sm text-white transition-colors placeholder:text-zinc-600" placeholder="Engineering" />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-zinc-500 uppercase">Role</label>
                  <select value={editForm.is_admin} onChange={(e) => setEditForm({...editForm, is_admin: e.target.value})} className="w-full px-3 py-2 rounded-lg bg-black border border-zinc-800 focus:border-zinc-500 outline-none text-sm text-white transition-colors cursor-pointer">
                    <option value="employee">Employee</option>
                    <option value="manager">Manager</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>
              </div>
              <div className="pt-4 flex items-center justify-end gap-3">
                <button type="button" onClick={() => setIsEditUserOpen(false)} className="px-4 py-2 text-sm font-medium text-zinc-400 hover:text-white transition-colors">Cancel</button>
                <button type="submit" disabled={isSubmitting} className="px-4 py-2 bg-white text-black hover:bg-zinc-200 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 disabled:opacity-50">
                  {isSubmitting ? <Loader2 size={16} className="animate-spin" /> : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {isEditSalaryOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-[#0a0a0a] border border-zinc-800 rounded-2xl w-full max-w-md shadow-2xl overflow-hidden animate-in zoom-in-95">
            <div className="flex items-center justify-between p-5 border-b border-zinc-900">
              <h2 className="text-lg font-semibold text-white">Edit Salary Record</h2>
              <button onClick={() => setIsEditSalaryOpen(false)} className="text-zinc-500 hover:text-white transition-colors" type="button">
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleEditSalarySubmit} className="p-5 space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-zinc-500 uppercase flex items-center gap-1.5"><UserCircle2 size={12}/> Employee Name</label>
                <select required value={editSalaryForm.emp_name} onChange={(e) => setEditSalaryForm({...editSalaryForm, emp_name: e.target.value})} className="w-full px-3 py-2 rounded-lg bg-black border border-zinc-800 focus:border-zinc-500 outline-none text-sm text-white transition-colors cursor-pointer">
                  <option value="" disabled>Select an employee</option>
                  {employees.map((emp) => (
                    <option key={`edit-sal-${emp._id}`} value={emp.emp_name}>{emp.emp_name}</option>
                  ))}
                </select>
              </div>
              
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-zinc-500 uppercase">Basic ($)</label>
                  <input type="number" required min="0" value={editSalaryForm.basic_salary} onChange={(e) => setEditSalaryForm({...editSalaryForm, basic_salary: e.target.value})} className="w-full px-3 py-2 rounded-lg bg-black border border-zinc-800 focus:border-zinc-500 outline-none text-sm text-white transition-colors placeholder:text-zinc-600" placeholder="5000" />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-zinc-500 uppercase">Bonus ($)</label>
                  <input type="number" required min="0" value={editSalaryForm.bonus} onChange={(e) => setEditSalaryForm({...editSalaryForm, bonus: e.target.value})} className="w-full px-3 py-2 rounded-lg bg-black border border-zinc-800 focus:border-zinc-500 outline-none text-sm text-white transition-colors placeholder:text-zinc-600" placeholder="500" />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-zinc-500 uppercase">Subtract ($)</label>
                  <input type="number" required min="0" value={editSalaryForm.deduction} onChange={(e) => setEditSalaryForm({...editSalaryForm, deduction: e.target.value})} className="w-full px-3 py-2 rounded-lg bg-black border border-zinc-800 focus:border-zinc-500 outline-none text-sm text-white transition-colors placeholder:text-zinc-600" placeholder="100" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-zinc-500 uppercase">Month</label>
                  <select value={editSalaryForm.month} onChange={(e) => setEditSalaryForm({...editSalaryForm, month: e.target.value})} className="w-full px-3 py-2 rounded-lg bg-black border border-zinc-800 focus:border-zinc-500 outline-none text-sm text-white transition-colors cursor-pointer">
                    {['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'].map(m => (
                      <option key={m} value={m}>{m}</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-zinc-500 uppercase">Year</label>
                  <input type="number" required value={editSalaryForm.year} onChange={(e) => setEditSalaryForm({...editSalaryForm, year: e.target.value})} className="w-full px-3 py-2 rounded-lg bg-black border border-zinc-800 focus:border-zinc-500 outline-none text-sm text-white transition-colors placeholder:text-zinc-600" placeholder="2023" />
                </div>
              </div>

              <div className="pt-4 flex items-center justify-end gap-3">
                <button type="button" onClick={() => setIsEditSalaryOpen(false)} className="px-4 py-2 text-sm font-medium text-zinc-400 hover:text-white transition-colors">Cancel</button>
                <button type="submit" disabled={isSubmitting} className="px-4 py-2 bg-white text-black hover:bg-zinc-200 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 disabled:opacity-50">
                  {isSubmitting ? <Loader2 size={16} className="animate-spin" /> : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <nav className="fixed top-0 left-0 h-full w-64 bg-[#0a0a0a] border-r border-zinc-900 hidden md:flex flex-col z-20">
        <div className="p-6 border-b border-zinc-900 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-100 shadow-sm">
            <Building size={18} />
          </div>
          <span className="font-semibold text-lg text-white tracking-tight">Enterprise</span>
        </div>

        <div className="flex-1 p-4 space-y-2 overflow-y-auto">
          <div className="px-3 py-2 text-xs font-semibold text-zinc-500 uppercase tracking-wider">Main Menu</div>
          
          <button 
            onClick={() => setCurrentTab("directory")}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium transition-all ${currentTab === "directory" ? "bg-zinc-900 border border-zinc-800 text-white" : "text-zinc-400 hover:text-white hover:bg-zinc-900 border border-transparent"}`}
          >
            <Users size={18} />
            <span>Directory</span>
          </button>

          {(user.is_admin === "admin" || user.is_admin === "manager") && (
            <button 
              onClick={() => setCurrentTab("salary")}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium transition-all ${currentTab === "salary" ? "bg-zinc-900 border border-zinc-800 text-white" : "text-zinc-400 hover:text-white hover:bg-zinc-900 border border-transparent"}`}
            >
              <WalletCards size={18} />
              <span>Salary Records</span>
            </button>
          )}

        </div>

        <div className="p-4 border-t border-zinc-900">
          <div className="flex items-center gap-3 px-3 py-3 rounded-xl bg-black border border-zinc-900 mb-4">
            <div className="w-10 h-10 rounded-full bg-zinc-900 flex items-center justify-center text-zinc-400 border border-zinc-800">
              <UserCircle2 size={20} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-white truncate">{user.emp_name}</p>
              <p className="text-[10px] text-zinc-500 uppercase tracking-wider truncate font-semibold">{user.is_admin}</p>
            </div>
          </div>
          <button onClick={logout} className="flex w-full items-center justify-center gap-2 px-3 py-2.5 text-sm rounded-xl text-zinc-400 hover:text-white hover:bg-zinc-900 font-medium transition-colors">
            <LogOut size={16} />
            <span>Sign out</span>
          </button>
        </div>
      </nav>

      <main className="md:ml-64 flex-1 min-h-screen relative overflow-hidden">
        <header className="sticky top-0 z-10 bg-[#050505]/80 backdrop-blur-md border-b border-zinc-900 px-8 py-5 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-semibold text-white">{currentTab === "directory" ? "People Directory" : "Salary Records"}</h1>
            <p className="text-sm text-zinc-500">{currentTab === "directory" ? "Manage and view employee information" : "Manage employee compensation securely"}</p>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="relative hidden sm:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" size={16} />
              <input
                type="text"
                placeholder={currentTab === "directory" ? "Search people..." : "Search by name..."}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9 pr-4 py-2 w-64 rounded-xl border border-zinc-800 bg-[#0a0a0a] focus:bg-black focus:border-zinc-600 outline-none transition-colors placeholder:text-zinc-600 text-sm"
              />
            </div>
            
            {currentTab === "directory" && (user.is_admin === "admin" || user.is_admin === "manager") && (
              <button onClick={() => setIsAddUserOpen(true)} className="flex items-center gap-2 bg-white hover:bg-zinc-200 text-black px-4 py-2 rounded-xl text-sm font-medium transition-colors cursor-pointer shadow-sm">
                <PlusCircle size={16} />
                <span className="hidden sm:inline">Add User</span>
              </button>
            )}

            {currentTab === "salary" && (user.is_admin === "admin" || user.is_admin === "manager") && (
              <button onClick={() => setIsAddSalaryOpen(true)} className="flex items-center gap-2 bg-zinc-800 hover:bg-zinc-700 text-white px-4 py-2 rounded-xl text-sm font-medium transition-colors border border-zinc-700 cursor-pointer shadow-sm">
                <PlusCircle size={16} />
                <span className="hidden sm:inline">Log Salary</span>
              </button>
            )}
          </div>
        </header>

        <div className="p-8 max-w-7xl mx-auto relative z-0">
          
          {error && (
            <div className="mb-6 p-4 rounded-xl bg-zinc-900 text-red-400 border border-zinc-800 text-sm">
              {error}
            </div>
          )}

          {currentTab === "directory" && (
            loading ? (
              <div className="flex items-center justify-center py-20">
                <Loader2 size={32} className="animate-spin text-zinc-600" />
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
                {filteredEmployees.map((emp) => (
                  <div key={emp._id} className="bg-[#0a0a0a] border border-zinc-900 hover:border-zinc-700/80 rounded-[20px] p-6 group transition-all duration-300">
                    <div className="flex justify-between items-start mb-5">
                      <div className="w-12 h-12 rounded-full bg-zinc-900 flex items-center justify-center text-zinc-400 text-lg font-semibold uppercase border border-zinc-800 shadow-inner">
                        {emp.emp_name.charAt(0)}
                      </div>
                      <span className="px-2.5 py-1 rounded-md text-[10px] font-semibold uppercase tracking-wider bg-zinc-900 text-zinc-400 border border-zinc-800">
                        {emp.is_admin}
                      </span>
                    </div>
                    
                    <div>
                      <h3 className="text-base font-medium text-white truncate">{emp.emp_name}</h3>
                      <p className="text-sm text-zinc-500 truncate mb-4">{emp.emp_email}</p>
                      <div className="flex items-center gap-2 text-xs font-medium text-zinc-400 bg-zinc-900 border border-zinc-800 px-2.5 py-1.5 rounded-lg w-fit">
                        <Building size={14} className="text-zinc-500" />
                        {emp.emp_department}
                      </div>
                    </div>

                    {(user.is_admin === "admin" || user.is_admin === "manager") ? (
                      <div className="mt-6 pt-5 border-t border-zinc-900 flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button onClick={() => openEditUserModal(emp)} className="p-2 text-zinc-500 hover:text-white hover:bg-zinc-800 rounded-lg transition-colors cursor-pointer"><Edit2 size={16} /></button>
                        {user.is_admin === "admin" && (
                          <button onClick={() => handleDeleteEmployee(emp._id)} className="p-2 text-zinc-500 hover:text-red-400 hover:bg-red-950/30 rounded-lg transition-colors cursor-pointer"><Trash2 size={16} /></button>
                        )}
                      </div>
                    ) : (
                      <div className="mt-6 pt-5 border-t border-zinc-900 opacity-0 h-10 pointer-events-none"></div>
                    )}
                  </div>
                ))}
                {filteredEmployees.length === 0 && (
                  <div className="col-span-full py-20 text-center">
                    <div className="inline-flex w-16 h-16 rounded-full bg-zinc-900 items-center justify-center text-zinc-600 mb-4 border border-zinc-800"><Search size={24} /></div>
                    <h3 className="text-lg font-medium text-white mb-1">No people found</h3>
                  </div>
                )}
              </div>
            )
          )}

          {currentTab === "salary" && (
            loadingSalaries ? (
              <div className="flex items-center justify-center py-20">
                <Loader2 size={32} className="animate-spin text-zinc-600" />
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
                {filteredSalaries.map((sal) => {
                  const totalNet = sal.basic_salary + sal.bonus - sal.deduction;
                  return (
                    <div key={sal._id} className="bg-[#0a0a0a] border border-zinc-900 hover:border-zinc-700/80 rounded-[20px] p-6 group transition-all duration-300">
                      
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3 className="text-base font-medium text-white truncate">{sal.emp_name}</h3>
                          <div className="text-[10px] text-zinc-500 uppercase tracking-wider mt-1">{sal.month} {sal.year}</div>
                        </div>
                        <div className="w-10 h-10 rounded-full bg-emerald-950/30 flex items-center justify-center text-emerald-500 border border-emerald-900/50">
                          <WalletCards size={18} />
                        </div>
                      </div>

                      <div className="py-5 border-y border-zinc-900 my-4 space-y-3">
                        <div className="flex justify-between items-center text-sm">
                          <span className="text-zinc-500">Basic Pay</span>
                          <span className="text-zinc-300 font-medium">${sal.basic_salary.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between items-center text-sm">
                          <span className="text-zinc-500 flex items-center gap-1"><ArrowUpRight size={14} className="text-emerald-500"/> Bonus</span>
                          <span className="text-emerald-400 font-medium">+${sal.bonus.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between items-center text-sm">
                          <span className="text-zinc-500 flex items-center gap-1"><ArrowDownRight size={14} className="text-red-500"/> Deduction</span>
                          <span className="text-red-400 font-medium">-${sal.deduction.toLocaleString()}</span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="text-xs text-zinc-500 font-medium uppercase tracking-wider">Net Salary</div>
                        <div className="text-xl font-semibold text-white">${totalNet.toLocaleString()}</div>
                      </div>

                      {(user.is_admin === "admin" || user.is_admin === "manager") && (
                        <div className="mt-4 pt-4 border-t border-zinc-900 flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button onClick={() => openEditSalaryModal(sal)} className="p-2 text-zinc-500 hover:text-white hover:bg-zinc-800 rounded-lg transition-colors cursor-pointer"><Edit2 size={16} /></button>
                          {user.is_admin === "admin" && (
                            <button onClick={() => handleDeleteSalary(sal._id)} className="p-2 text-zinc-500 hover:text-red-400 hover:bg-red-950/30 rounded-lg transition-colors cursor-pointer"><Trash2 size={16} /></button>
                          )}
                        </div>
                      )}

                    </div>
                  );
                })}

                {filteredSalaries.length === 0 && (
                  <div className="col-span-full py-20 text-center">
                    <div className="inline-flex w-16 h-16 rounded-full bg-zinc-900 items-center justify-center text-zinc-600 mb-4 border border-zinc-800"><WalletCards size={24} /></div>
                    <h3 className="text-lg font-medium text-white mb-1">No salary records</h3>
                    <p className="text-sm text-zinc-500">Log a new salary to see it here.</p>
                  </div>
                )}
              </div>
            )
          )}

        </div>
      </main>
    </div>
  );
}
