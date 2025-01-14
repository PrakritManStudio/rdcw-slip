import RdcwSlip from "@prakrit_m/rdcw-slip";

// สร้าง instance แบบพื้นฐาน
const slip = new RdcwSlip("YOUR_CLIENT_ID", "YOUR_CLIENT_SECRET");

async function main() {
  try {
    // ตรวจสอบ quota
    const quotaResult = await slip.checkQuota();
    console.log("Quota Result:", quotaResult);

    // ตรวจสอบ slip
    const payload = "0034000600000101039990213mamauishigure5102TH91046B93";
    const slipResult = await slip.checkSlip(payload);
    console.log("Slip Result:", slipResult);
  } catch (error) {
    console.error("Error:", error);
  }
}

main(); 