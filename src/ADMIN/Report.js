// utils/reportUtils.js
export function generateUserObligationReport(userData) {
  let report = "User Financial Obligations Report\n\n";
  userData.forEach(user => {
    report += `Name: ${user.first_name} ${user.last_name}\n`;
    report += `Email: ${user.email}\n`;
    report += `Obligation Q1: $${user.quarters[0]}\n`;
    report += `Obligation Q2: $${user.quarters[1]}\n`;
    report += `Obligation Q3: $${user.quarters[2]}\n`;
    report += `Obligation Q4: $${user.quarters[3]}\n`;
    report += `\n`
  });
  return report;
}

export function downloadReport(reportContent, fileName = 'report.txt') {
  const blob = new Blob([reportContent], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
