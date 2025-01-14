import RdcwSlip from "@prakrit_m/rdcw-slip";

/**
 * ตัวอย่างการใช้งานขั้นสูงของ RDCW Slip SDK
 * 
 * ตัวอย่างนี้แสดงวิธีการ:
 * 1. กำหนดค่า logger แบบกำหนดเอง
 * 2. สร้าง instance พร้อมการตั้งค่าเพิ่มเติม
 * 3. แสดงข้อมูลการโอนเงินแบบละเอียด
 * 4. ตรวจสอบและแสดงผลโควต้าแบบละเอียด
 */

// สร้าง custom logger เพื่อบันทึกการทำงานของ SDK
const logger = {
  debug: (message: string, ...args: any[]) => console.debug(`[DEBUG] ${message}`, ...args),
  info: (message: string, ...args: any[]) => console.info(`[INFO] ${message}`, ...args),
  error: (message: string, ...args: any[]) => console.error(`[ERROR] ${message}`, ...args)
};

// สร้าง instance พร้อมการตั้งค่าเพิ่มเติม
const slip = new RdcwSlip("YOUR_CLIENT_ID", "YOUR_CLIENT_SECRET", {
  timeout: 5000,      // กำหนด timeout 5 วินาที
  retries: 3,         // ลองใหม่อัตโนมัติ 3 ครั้งเมื่อเกิดข้อผิดพลาด
  logger: logger,     // ใช้ custom logger
  baseUrl: "https://suba.rdcw.co.th/v1/inquiry",  // URL ของ API
  testPayload: "0034000600000101039990213mamauishigure5102TH91046B93"  // QR สำหรับทดสอบ
});

/**
 * ฟังก์ชันตรวจสอบสลิปและแสดงข้อมูลแบบละเอียด
 * @param payload - ข้อมูล QR Code จากสลิป
 */
async function verifySlip(payload: string) {
  try {
    const result = await slip.checkSlip(payload);
    
    if (result.success && result.valid) {
      const { data } = result.data;
      // ตัวอย่างแสดงข้อมูลการโอนเงินเบื่องตัน
      console.log("การโอนเงินสำเร็จ:");
      console.log(`- จำนวนเงิน: ${data.amount / 100} บาท`);  // แปลงจากสตางค์เป็นบาท
      console.log(`- วันที่โอน: ${data.transDate}`);         // รูปแบบ YYYYMMDD
      console.log(`- เวลาที่โอน: ${data.transTime}`);        // รูปแบบ HHmmss
      console.log(`- ธนาคารผู้โอน: ${data.sendingBank}`);
      console.log(`- ชื่อผู้โอน: ${data.sender.name}`);
    } else {
      console.log("การตรวจสอบไม่สำเร็จ:", result);
    }
  } catch (error) {
    console.error("เกิดข้อผิดพลาด:", error);
  }
}

/**
 * ฟังก์ชันตรวจสอบและแสดงข้อมูลโควต้าคงเหลือ
 */
async function checkRemainingQuota() {
  try {
    const result = await slip.checkQuota();
    
    if (result.success) {
      const { usage, limit } = result.quota;
      // แสดงข้อมูลโควต้าคงเหลือ
      console.log(`โควต้าคงเหลือ: ${limit - usage} ครั้ง`);
      console.log(`ใช้ไปแล้ว: ${usage} ครั้ง`);
      console.log(`โควต้าทั้งหมด: ${limit} ครั้ง`);
    } else {
      console.log("ไม่สามารถตรวจสอบโควต้าได้:", result);
    }
  } catch (error) {
    console.error("เกิดข้อผิดพลาด:", error);
  }
}

// ทดสอบการใช้งาน
const testPayload = "0034000600000101039990213mamauishigure5102TH91046B93";
verifySlip(testPayload);
checkRemainingQuota(); 