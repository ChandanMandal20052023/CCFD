import React from "react";

const activities = [
  { name: "Azure", status: "Pending", category: "Workshop", date: "31 Aug 2025" },
  { name: "Techgyan", status: "Approved", category: "Workshop", date: "26 Aug 2025" },
  { name: "Hackverse", status: "Rejected", category: "Hackathon", date: "11 July 2025" },
  { name: "Python", status: "Approved", category: "Course", date: "31 May 2025" },
];

const getStatusStyle = (status) => {
  switch (status) {
    case "Approved":
      return "bg-[#E6FFE6] text-[#004700] px-3 py-1 rounded-[5px] text-[16px] font-manrope  font-medium";
    case "Pending":
      return "bg-[#FEE8D6] text-[#C77F44] px-3 py-1 rounded-[5px] text-[16px]  font-manrope font-medium";
    case "Rejected":
      return "bg-[#FFE6E6] text-[#750000] px-3 py-1 rounded-[5px] text-[16px] font-manrope  font-medium";
    default:
      return "";
  }
};

export default function ActivityTable() {
  return (
    <div className="py-6 px-4 md:w-auto w-[100vw]">
        <h2 className='font-manrope font-bold text-[22px] pb-3 md:m-0 mx-2 md:mx-6 text-font-color'>Your Activities</h2>
      {/* Top Controls */}
      <div className="flex justify-between items-center mb-4 mt-2 font-manrope w-fit md:w-[75vw]">
        <div className="flex gap-4">
          <input
            type="text"
            placeholder="Search activities..."
            className="border rounded-[5px] px-3 py-2 text-[14px] md:text-[16px] w-full hidden md:block"
          />
          <select className="border rounded-[5px] px-3 py-2 text-[14px] md:text-[16px] font-manrope">
            <option>Status</option>
            <option>Approved</option>
            <option>Pending</option>
            <option>Rejected</option>
          </select>
        </div>
        <div className="flex gap-4">
          <button className="hidden md:flex border px-4 py-2 rounded-[5px] text-[16px] justify-center items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-cloud-download-icon lucide-cloud-download"><path d="M12 13v8l-4-4"/><path d="m12 21 4-4"/><path d="M4.393 15.269A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.436 8.284"/></svg>
            Export</button>
          <button className="bg-accent text-white md:ml-0 ml-[10%]  px-4 py-2 rounded-[5px] text-[14px] md:text-[16px] flex justify-center items-center gap-2 text-nowrap">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-circle-plus-icon lucide-circle-plus"><circle cx="12" cy="12" r="10"/><path d="M8 12h8"/><path d="M12 8v8"/></svg>
             Submit for Approval
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-hidden w-full border rounded-[10px]">
        <table className="text-left border-collapse w-[100vw] md:w-[75vw]">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-6 py-3 text-[16px] font-manrope font-semibold">Name</th>
              <th className="px-6 py-3 text-[16px] font-manrope font-semibold">Status</th>
              <th className="px-6 py-3 text-[16px] font-manrope font-semibold hidden md:table-cell">Category</th>
              <th className="px-6 py-3 text-[16px] font-manrope font-semibold hidden md:table-cell">Date Added</th>
              <th className="px-6 py-3 text-[16px] font-manrope font-semibold hidden md:table-cell">Manage</th>
            </tr>
          </thead>
          <tbody>
            {activities.map((activity, idx) => (
              <tr key={idx} className="border-t">
                <td className="px-6  py-4 font-manrope">{activity.name}</td>
                <td className="px-6  py-4 font-manrope">
                  <span className={getStatusStyle(activity.status)}>
                    {activity.status}
                  </span>
                </td>
                <td className="px-6 py-4 font-manrope hidden md:block">
                  <span className="bg-[#e5e5e5] px-3 py-1 rounded-[5px] text-[16px]">
                    {activity.category}
                  </span>
                </td>
                <td className="px-6 py-4 font-manrope hidden md:table-cell">{activity.date}</td>
                <td className="px-6 py-4 font-manrope  hidden md:table-cell">
                  <button className="bg-[#e5e5e5] px-4 py-1 rounded-[5px] text-[16px]">
                    Manage
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
