export function formatDate(dateValue) {
    if (!dateValue) return "";
  
    const d = dateValue?.toDate?.() || new Date(dateValue);
    if (isNaN(d)) return "";
  
    const format =
      localStorage.getItem("tasky_dateFormat") || "YYYY-MM-DD";
  
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const dd = String(d.getDate()).padStart(2, "0");
  
    if (format === "MM-DD") {
      return `${mm}-${dd}`;
    }
  
    return `${yyyy}-${mm}-${dd}`;
  }
  